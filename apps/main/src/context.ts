import _ from "lodash";
import DataLoader from "dataloader";
import { BrowserWindow } from "electron";

import { BaseContext } from "@apollo/server";

import { Album } from "@album/models/album.model";
import { AlbumArt } from "@album-art/models/album-art.model";
import { Artist } from "@artist/models/artist.model";
import { Image } from "@image/models/image.model";
import { Music } from "@music/models/music.model";

import { AlbumService } from "@album/album.service";
import { AlbumArtService } from "@album-art/album-art.service";
import { ArtistService } from "@artist/artist.service";
import { ImageService } from "@image/image.service";
import { MusicService } from "@music/music.service";

export interface GraphQLContext extends BaseContext {
    window: BrowserWindow | null;
    loaders: {
        album: DataLoader<number, Album>;
        albumArt: DataLoader<number, AlbumArt>;
        artist: DataLoader<number, Artist>;
        image: DataLoader<number, Image>;
        music: DataLoader<number, Music>;
        primaryAlbumArt: DataLoader<number[], AlbumArt | null, string>;
    };
}

export async function createGraphQLContext(
    window: Electron.CrossProcessExports.BrowserWindow | null,
    albumService: AlbumService,
    albumArtService: AlbumArtService,
    artistService: ArtistService,
    imageService: ImageService,
    musicService: MusicService,
): Promise<GraphQLContext> {
    return {
        window,
        loaders: {
            album: new DataLoader<number, Album>(ids => albumService.findByIds(ids)),
            albumArt: new DataLoader<number, AlbumArt>(ids => albumArtService.findByIds(ids)),
            artist: new DataLoader<number, Artist>(ids => artistService.findByIds(ids)),
            image: new DataLoader<number, Image>(ids => imageService.findByIds(ids)),
            music: new DataLoader<number, Music>(ids => musicService.findByIds(ids)),
            primaryAlbumArt: new DataLoader<number[], AlbumArt | null, string>(
                async idChunks => {
                    const allItems = await albumArtService.findAll();
                    const itemMap = _.keyBy(allItems, item => item.id);
                    const albumArtChunks = idChunks.map(idChunk => idChunk.map(id => itemMap[id] ?? null));

                    return albumArtChunks.map(albumArts => {
                        return albumArts.find(albumArt => albumArt?.type === "Cover (front)") ?? albumArts[0] ?? null;
                    });
                },
                { cacheKeyFn: key => key.join(",") },
            ),
        },
    };
}
