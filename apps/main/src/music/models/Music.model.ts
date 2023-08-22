import { Field, ObjectType, Int, Float } from "@nestjs/graphql";

import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from "typeorm";
import { Nullable } from "types";

@Entity({ name: "musics" })
@ObjectType()
export class Music extends BaseEntity {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    public id!: number;

    @Field(() => String, { nullable: true })
    @Column({ type: "text", nullable: true })
    public title!: Nullable<string>;

    @Field(() => String, { nullable: true })
    @Column({ type: "text", nullable: true })
    public artist!: Nullable<string>;

    @Field(() => [String])
    @Column({ type: "simple-array" })
    public artists!: string[];

    @Field(() => String, { nullable: true })
    @Column({ type: "text", nullable: true })
    public album!: Nullable<string>;

    @Field(() => String, { nullable: true })
    @Column({ type: "text", nullable: true })
    public albumArtist!: Nullable<string>;

    @Field(() => [String])
    @Column({ type: "simple-array" })
    public genre!: string[];

    @Field(() => String, { nullable: true })
    @Column({ type: "int", nullable: true })
    public year!: Nullable<number>;

    @Field(() => Int, { nullable: true })
    @Column({ type: "int", nullable: true })
    public trackNumber!: Nullable<number>;

    @Field(() => Int, { nullable: true })
    @Column({ type: "int", nullable: true })
    public discNumber!: Nullable<number>;

    @Field(() => Float)
    @Column({ type: "float" })
    public duration!: Nullable<number>;

    @Field(() => String)
    @Column({ type: "text" })
    public filePath!: Nullable<string>;
}
