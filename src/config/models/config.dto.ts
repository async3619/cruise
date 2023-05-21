import { Field, InputType, ObjectType, registerEnumType } from "@nestjs/graphql";

export enum AppTheme {
    Light = "light",
    Dark = "dark",
    System = "system",
}

registerEnumType(AppTheme, { name: "AppTheme" });

@InputType()
export class ConfigInput {
    @Field(() => [String])
    public libraryDirectories!: string[];

    @Field(() => AppTheme)
    public appTheme!: AppTheme;
}

@ObjectType()
export class Config {
    @Field(() => [String])
    public libraryDirectories!: string[];

    @Field(() => AppTheme)
    public appTheme!: AppTheme;
}
