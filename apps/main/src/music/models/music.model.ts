import { Nullable } from "types";

import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    RelationId,
} from "typeorm";
import { Field, Float, Int, ObjectType } from "@nestjs/graphql";

import { Album } from "@album/models/album.model";
import { Artist } from "@artist/models/artist.model";
import { AlbumArt } from "@album-art/models/album-art.model";

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
    public artistName!: Nullable<string>;

    @Field(() => [String])
    @Column({ type: "simple-array" })
    public artistNames!: string[];

    @Field(() => String, { nullable: true })
    @Column({ type: "text", nullable: true })
    public albumTitle!: Nullable<string>;

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
    public filePath!: string;

    @Field(() => Date)
    @CreateDateColumn()
    public createdAt!: Date;

    @Field(() => Date)
    @CreateDateColumn()
    public updatedAt!: Date;

    // Music[] => Album
    @ManyToOne(() => Album, item => item.musics)
    public album!: Album;

    @RelationId((item: Music) => item.album)
    public albumId!: Album["id"];

    // Music[] => Artist[]
    @ManyToMany(() => Artist, item => item.musics)
    @JoinTable()
    public artists!: Artist[];

    @RelationId((item: Music) => item.artists)
    public artistIds!: Artist["id"][];

    // Music => AlbumArt[]
    @OneToMany(() => AlbumArt, item => item.music)
    public albumArts!: AlbumArt[];

    @RelationId((item: Music) => item.albumArts)
    public albumArtIds!: AlbumArt["id"][];
}
