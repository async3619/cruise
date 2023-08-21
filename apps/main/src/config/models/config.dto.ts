import { Field, InputType, ObjectType, registerEnumType } from "@nestjs/graphql";

export enum ColorMode {
    Light = "Light",
    Dark = "Dark",
    System = "System",
}

registerEnumType(ColorMode, { name: "ColorMode" });

@ObjectType()
export class ConfigData {
    @Field(() => ColorMode)
    public colorMode!: ColorMode;

    @Field(() => String)
    public language!: string;
}

@InputType()
export class ConfigUpdateInput {
    @Field(() => ColorMode, { nullable: true })
    public colorMode?: ColorMode;

    @Field(() => String, { nullable: true })
    public language?: string;
}
