import { Field, InputType } from "@nestjs/graphql";

import { AlbumArtType } from "@main/album-art/models/album-art.model";

@InputType()
export class AlbumArtInput {
    @Field(() => String)
    public path!: string;

    @Field(() => AlbumArtType)
    public type!: AlbumArtType;

    @Field(() => String, { nullable: true })
    public description?: string;
}
