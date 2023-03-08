import { DataSource } from "typeorm";
import { buildSchema, getMetadataStorage } from "type-graphql";
import { Container } from "typedi";

import MusicResolver from "@main/music/music.resolver";
import AlbumResolver from "@main/album/album.resolver";
import ArtistResolver from "@main/artist/artist.resolver";
import LibraryResolver from "@main/library/library.resolver";

export async function initializeSchema(dataSource: DataSource) {
    const metadataStorage = getMetadataStorage();
    for (const objectType of metadataStorage.objectTypes) {
        Container.set(objectType.target.name, dataSource.getRepository(objectType.target));
    }

    return await buildSchema({
        resolvers: [MusicResolver, LibraryResolver, AlbumResolver, ArtistResolver],
        container: Container,
    });
}
