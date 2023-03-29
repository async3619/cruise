import { BrowserWindow } from "electron";
import DataLoader from "dataloader";

import { BaseContext } from "@apollo/server";

import { MusicService } from "@main/music/music.service";
import { Music } from "@main/music/models/music.model";

import { AlbumService } from "@main/album/album.service";
import { Album } from "@main/album/models/album.model";

import { ArtistService } from "@main/artist/artist.service";
import { Artist } from "@main/artist/models/artist.model";

import { AlbumArtService } from "@main/album-art/album-art.service";
import { AlbumArt } from "@main/album-art/models/album-art.model";

export interface GraphQLContext extends BaseContext {
    window: BrowserWindow | null;
    loaders: {
        music: DataLoader<number, Music>;
        album: DataLoader<number, Album>;
        artist: DataLoader<number, Artist>;
        albumArt: DataLoader<number, AlbumArt>;
    };
}

export async function createGraphQLContext(
    window: Electron.CrossProcessExports.BrowserWindow | null,
    musicService: MusicService,
    albumService: AlbumService,
    artistService: ArtistService,
    albumArtService: AlbumArtService,
): Promise<GraphQLContext> {
    return {
        window,
        loaders: {
            music: new DataLoader<number, Music>(
                ids => {
                    return musicService.findByIds(ids);
                },
                { cache: false },
            ),
            album: new DataLoader<number, Album>(
                ids => {
                    return albumService.findByIds(ids);
                },
                { cache: false },
            ),
            artist: new DataLoader<number, Artist>(
                ids => {
                    return artistService.findByIds(ids);
                },
                { cache: false },
            ),
            albumArt: new DataLoader<number, AlbumArt>(
                ids => {
                    return albumArtService.findByIds(ids);
                },
                { cache: false },
            ),
        },
    };
}
