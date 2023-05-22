import { Field, Float, InputType, ObjectType, registerEnumType } from "@nestjs/graphql";

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

    @Field(() => Float)
    public volume!: number;

    @Field(() => Boolean)
    public muted!: boolean;
}

@ObjectType()
export class Config {
    @Field(() => [String])
    public libraryDirectories!: string[];

    @Field(() => AppTheme)
    public appTheme!: AppTheme;

    @Field(() => Float)
    public volume!: number;

    @Field(() => Boolean)
    public muted!: boolean;
}
