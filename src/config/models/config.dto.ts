import { Field, InputType, ObjectType } from "@nestjs/graphql";

@InputType()
export class ConfigInput {
    @Field(() => [String])
    public libraryDirectories!: string[];
}

@ObjectType()
export class Config {
    @Field(() => [String])
    public libraryDirectories!: string[];
}
