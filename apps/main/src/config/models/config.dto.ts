import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";

export enum ColorMode {
    Light = "light",
    Dark = "dark",
    System = "system",
}

registerEnumType(ColorMode, { name: "ColorMode" });

@ObjectType()
export class ConfigData {
    @Field(() => ColorMode)
    public colorMode!: ColorMode;
}
