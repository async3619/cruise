import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Language {
    @Field(() => String)
    public name!: string;

    @Field(() => String)
    public code!: string;
}
