import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreatePlaylistInput {
    @Field(() => String)
    public name!: string;
}

@InputType()
export class UpdatePlaylistInput {
    @Field(() => String, { nullable: true })
    public name?: string;
}
