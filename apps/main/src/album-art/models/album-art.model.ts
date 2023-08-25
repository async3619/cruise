import { Nullable } from "types";

import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, RelationId, ManyToOne } from "typeorm";
import { Field, ObjectType, Int } from "@nestjs/graphql";

import { Image } from "@image/models/image.model";
import { Music } from "@music/models/music.model";
import { Album } from "@album/models/album.model";

@Entity({ name: "album-arts" })
@ObjectType()
export class AlbumArt extends BaseEntity {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    public id!: number;

    @Field(() => String, { nullable: true })
    @Column({ type: "text", nullable: true })
    public type!: Nullable<string>;

    @Field(() => String, { nullable: true })
    @Column({ type: "text", nullable: true })
    public description!: Nullable<string>;

    @Field(() => Date)
    @CreateDateColumn()
    public createdAt!: Date;

    @Field(() => Date)
    @CreateDateColumn()
    public updatedAt!: Date;

    // AlbumArt[] => Image
    @ManyToOne(() => Image, item => item.albumArts)
    public image!: Image;

    @RelationId((item: AlbumArt) => item.image)
    public imageId!: Image["id"];

    // AlbumArt[] => Music
    @ManyToOne(() => Music, item => item.albumArts)
    public music!: Music;

    @RelationId((item: AlbumArt) => item.music)
    public musicId!: Music["id"];

    // AlbumArt[] => Album
    @ManyToOne(() => Album, item => item.albumArts)
    public album!: Album;

    @RelationId((item: AlbumArt) => item.album)
    public albumId!: Album["id"];
}
