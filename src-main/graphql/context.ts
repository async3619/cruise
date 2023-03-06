import { BrowserWindow } from "electron";
import DataLoader from "dataloader";

import { GraphQLContext } from "@main/graphql/types";

import { Artist } from "@main/artist/models/artist.model";
import { Album } from "@main/album/models/album.model";
import { Music } from "@main/music/models/music.model";

import ArtistService from "@main/artist/artist.service";
import AlbumService from "@main/album/album.service";
import MusicService from "@main/music/music.service";

export function createGraphQLContext(
    window: BrowserWindow,
    artistService: ArtistService,
    albumService: AlbumService,
    musicService: MusicService,
): () => GraphQLContext {
    return () => {
        return {
            window,
            artistLoader: new DataLoader<number, Artist>(async ids => {
                return artistService.getItemsByIds(ids);
            }),
            albumLoader: new DataLoader<number, Album>(async ids => {
                return albumService.getItemsByIds(ids);
            }),
            musicLoader: new DataLoader<number, Music>(async ids => {
                return musicService.getItemsByIds(ids);
            }),
        };
    };
}
