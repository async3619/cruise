import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Music } from "@main/music/models/music.model";
import { Album } from "@main/album/models/album.model";
import { Artist } from "@main/artist/models/artist.model";

@ObjectType()
export class SearchResult {
    @Field(() => [Music])
    public musics!: Music[];

    @Field(() => [Album])
    public albums!: Album[];

    @Field(() => [Artist])
    public artists!: Artist[];

    @Field(() => Int)
    public total!: number;
}
