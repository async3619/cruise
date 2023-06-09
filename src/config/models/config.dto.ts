import { Field, Float, InputType, ObjectType, registerEnumType } from "@nestjs/graphql";

export enum AppTheme {
    Light = "light",
    Dark = "dark",
    System = "system",
}

export enum RepeatMode {
    None = "none",
    One = "one",
    All = "all",
}

registerEnumType(AppTheme, { name: "AppTheme" });
registerEnumType(RepeatMode, { name: "RepeatMode" });

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

    @Field(() => RepeatMode)
    public repeatMode!: RepeatMode;

    @Field(() => String)
    public language!: string;
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

    @Field(() => RepeatMode)
    public repeatMode!: RepeatMode;

    @Field(() => String)
    public language!: string;
}
