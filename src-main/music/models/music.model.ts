import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
    RelationId,
    UpdateDateColumn,
} from "typeorm";
import { Field, Int, ObjectType } from "type-graphql";

import { Artist } from "@main/artist/models/artist.model";
import { Album } from "@main/album/models/album.model";
import { AlbumArt } from "@main/album-art/models/album-art.model";

import type { Nullable } from "@main/utils/types";

@ObjectType("Music")
@Entity({ name: "musics" })
export class Music extends BaseEntity {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    public id!: number;

    @Field(() => String)
    @Column({ type: "text" })
    public title!: string;

    @Field(() => String, { nullable: true })
    @Column({ type: "text", nullable: true })
    public albumArtist?: Nullable<string>;

    @Field(() => String, { nullable: true })
    @Column({ type: "text", nullable: true })
    public genre?: Nullable<string>;

    @Field(() => Int, { nullable: true })
    @Column({ type: "integer", nullable: true })
    public year?: Nullable<number>;

    @Field(() => Int, { nullable: true })
    @Column({ type: "integer", nullable: true })
    public track?: Nullable<number>;

    @Field(() => Int, { nullable: true })
    @Column({ type: "integer", nullable: true })
    public disc?: Nullable<number>;

    @Field(() => Int)
    @Column({ type: "integer" })
    public duration!: number;

    @Field(() => String)
    @Column({ type: "text" })
    public path!: string;

    @Field(() => Date)
    @CreateDateColumn()
    public createdAt!: Date;

    @Field(() => Date)
    @UpdateDateColumn()
    public updatedAt!: Date;

    // Music[] => Artist[]
    @Field(() => [Artist])
    @ManyToMany(() => Artist, item => item.musics, { cascade: true })
    @JoinTable()
    public artists!: Artist[];

    @RelationId((item: Music) => item.artists)
    public artistIds!: Artist["id"][];

    // Music[] => Album
    @Field(() => Album, { nullable: true })
    @ManyToOne(() => Album, item => item.musics)
    public album?: Album;

    @RelationId((item: Music) => item.album)
    public albumId?: Album["id"];

    // Music[] => AlbumArt[]
    @Field(() => [AlbumArt])
    @ManyToMany(() => AlbumArt, item => item.musics, { cascade: true })
    @JoinTable()
    public albumArts!: AlbumArt[];

    @RelationId((item: Music) => item.albumArts)
    public albumArtIds!: AlbumArt["id"][];
}
