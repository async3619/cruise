import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class SelectPathFilterInput {
    @Field(() => String)
    public name!: string;

    @Field(() => [String])
    public extensions!: string[];
}
