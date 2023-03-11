import { Repository } from "typeorm";
import { Service } from "typedi";
import glob from "fast-glob";
import * as path from "path";
import * as fs from "fs-extra";

import { Audio, AlbumArt as RawAlbumArt } from "@async3619/merry-go-round";

import { Music } from "@main/music/models/music.model";
import { Artist } from "@main/artist/models/artist.model";
import { Album } from "@main/album/models/album.model";
import { AlbumArt, AlbumArtType } from "@main/album-art/models/album-art.model";

import { getConfig } from "@main/config";
import { ALBUM_ART_PATH } from "@main/constants";

import { InjectRepository } from "@main/utils/models";
import { getImageSize, ImageSize } from "@main/utils/images";

@Service()
export class LibraryService {
    public constructor(
        @InjectRepository(Music) private readonly musicRepository: Repository<Music>,
        @InjectRepository(Artist) private readonly artistRepository: Repository<Artist>,
        @InjectRepository(Album) private readonly albumRepository: Repository<Album>,
        @InjectRepository(AlbumArt) private readonly albumArtRepository: Repository<AlbumArt>,
    ) {}

    private async generateAlbumArt(rawAlbumArt: RawAlbumArt, music: Music, index: number) {
        const extension = rawAlbumArt.mimeType.split("/")[1];
        const targetPath = path.join(ALBUM_ART_PATH, `${music.id}.${index}.${extension}`);
        const buffer = rawAlbumArt.data();

        await fs.ensureDir(path.dirname(targetPath));
        await fs.writeFile(targetPath, buffer);

        let imageSize: ImageSize;
        try {
            imageSize = await getImageSize(buffer);
        } catch (e) {
            await fs.rm(targetPath);

            console.error(e);
            return null;
        }

        let albumArtEntity = this.albumArtRepository.create();
        albumArtEntity.path = targetPath;
        albumArtEntity.mimeType = rawAlbumArt.mimeType;
        albumArtEntity.size = buffer.length;
        albumArtEntity.width = imageSize.width;
        albumArtEntity.height = imageSize.height;
        albumArtEntity.type = rawAlbumArt.type as unknown as AlbumArtType;
        albumArtEntity.musics = [music];
        albumArtEntity = await this.albumArtRepository.save(albumArtEntity);

        return albumArtEntity;
    }

    public async rescan() {
        await this.musicRepository.clear();
        await this.artistRepository.clear();
        await this.albumRepository.clear();

        const { libraryDirectories } = await getConfig();
        const audioPaths: string[] = [];

        for (const directory of libraryDirectories) {
            const targetPaths = await glob("./**/*.mp3", {
                cwd: directory,
            });

            audioPaths.push(...targetPaths.map(p => path.join(directory, p)));
        }

        const audios = new Map<string, Audio>();
        for (const audioPath of audioPaths) {
            const audio = Audio.fromFile(audioPath);
            audios.set(audioPath, audio);
        }

        const artists: Record<string, Artist> = {};
        for (const [, audio] of audios) {
            const targetArtistNames = [...(audio.artists || []), ...(audio.albumArtist ? [audio.albumArtist] : [])];
            for (const artistName of targetArtistNames) {
                if (!artists[artistName]) {
                    let artist = this.artistRepository.create();
                    artist.name = artistName;

                    artist = await this.artistRepository.save(artist);
                    artists[artistName] = artist;
                }
            }
        }

        const albums: Record<string, Album> = {};
        for (const [, audio] of audios) {
            const albumName = audio.album;
            if (albumName && !albums[albumName]) {
                let album = this.albumRepository.create();
                album.title = albumName;

                album = await this.albumRepository.save(album);
                albums[albumName] = album;
            }
        }

        const albumArtists: Record<string, Artist[]> = {};
        for (const [audioPath, audio] of audios) {
            const fileName = path.basename(audioPath);
            let music = this.musicRepository.create();
            music.title = audio.title || fileName;
            music.genre = audio.genre;
            music.year = audio.year;
            music.track = audio.track;
            music.disc = audio.disc;
            music.duration = audio.duration;
            music.albumArtist = audio.albumArtist;
            music.path = audioPath;

            music.album = albums[audio.album || "Unknown Album"];
            music.artists = audio.artists
                .map(artist => {
                    return artists[artist];
                })
                .filter((artist): artist is Artist => !!artist);

            const albumName = audio.album;
            const albumArtist = audio.albumArtist || audio.artists[0];
            if (albumName && albumArtist && artists[albumArtist]) {
                albumArtists[albumName] ??= [];
                if (!albumArtists[albumName].some(a => a.name === albumArtist)) {
                    albumArtists[albumName].push(artists[albumArtist]);
                }
            }

            music = await this.musicRepository.save(music);

            const albumArts = audio.albumArts();
            const albumArtEntities: AlbumArt[] = [];
            for (let i = 0; i < albumArts.length; i++) {
                const albumArt = albumArts[i];
                const albumArtEntity = await this.generateAlbumArt(albumArt, music, i);
                if (!albumArtEntity) {
                    continue;
                }

                albumArtEntities.push(albumArtEntity);
            }

            music.albumArts = albumArtEntities;
            music = await this.musicRepository.save(music);

            // set album.year to the biggest music.year
            if (music.album && music.year && (!music.album.year || music.album.year < music.year)) {
                music.album.year = music.year;
                await this.albumRepository.save(music.album);
            }
        }

        for (const [albumName, artists] of Object.entries(albumArtists)) {
            const album = albums[albumName];
            if (!album) {
                continue;
            }

            album.artists = artists;
            await this.albumRepository.save(album);
        }

        return true;
    }
}
