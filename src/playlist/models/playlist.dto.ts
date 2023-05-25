import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreatePlaylistInput {
    @Field(() => String)
    public name!: string;
}
