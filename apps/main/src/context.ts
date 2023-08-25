import DataLoader from "dataloader";
import { BrowserWindow } from "electron";

import { BaseContext } from "@apollo/server";

import { Album } from "@album/models/album.model";
import { AlbumArt } from "@album-art/models/album-art.model";
import { Artist } from "@artist/models/artist.model";

import { AlbumService } from "@album/album.service";
import { AlbumArtService } from "@album-art/album-art.service";
import { ArtistService } from "@artist/artist.service";

export interface GraphQLContext extends BaseContext {
    window: BrowserWindow | null;
    loaders: {
        album: DataLoader<number, Album>;
        albumArt: DataLoader<number, AlbumArt>;
        artist: DataLoader<number, Artist>;
    };
}

export async function createGraphQLContext(
    window: Electron.CrossProcessExports.BrowserWindow | null,
    albumService: AlbumService,
    albumArtService: AlbumArtService,
    artistService: ArtistService,
): Promise<GraphQLContext> {
    return {
        window,
        loaders: {
            album: new DataLoader<number, Album>(ids => albumService.findByIds(ids)),
            albumArt: new DataLoader<number, AlbumArt>(ids => albumArtService.findByIds(ids)),
            artist: new DataLoader<number, Artist>(ids => artistService.findByIds(ids)),
        },
    };
}
