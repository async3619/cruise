import { Field, ObjectType } from "@nestjs/graphql";

import { Music } from "@music/models/music.model";
import { Artist } from "@artist/models/artist.model";
import { Album } from "@album/models/album.model";

@ObjectType()
export class SearchResult {
    @Field(() => [Music])
    public musics!: Music[];

    @Field(() => [Artist])
    public artists!: Artist[];

    @Field(() => [Album])
    public albums!: Album[];
}
