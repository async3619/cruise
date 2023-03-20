import { Field, InputType } from "@nestjs/graphql";

import type { Nullable } from "@common/types";

@InputType()
export class UpdateAlbumInput {
    @Field(() => String)
    public title!: string;

    @Field(() => [String])
    public albumArtists!: string[];

    @Field(() => String, { nullable: true })
    public genre?: Nullable<string>;

    @Field(() => String, { nullable: true })
    public year?: Nullable<string>;
}
