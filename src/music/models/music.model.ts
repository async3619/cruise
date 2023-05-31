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
    UpdateDateColumn,
} from "typeorm";
import { Field, Int, ObjectType } from "@nestjs/graphql";

import { Artist } from "@main/artist/models/artist.model";
import { Album } from "@main/album/models/album.model";
import { AlbumArt } from "@main/album-art/models/album-art.model";
import { PlaylistRelation } from "@main/playlist/models/playlist-relation.model";

import type { Nullable } from "@common/types";

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
    @ManyToMany(() => Artist, item => item.albumMusics, { cascade: true })
    @JoinTable()
    public albumArtists!: Artist[];

    @RelationId((item: Music) => item.albumArtists)
    public albumArtistIds!: Artist["id"][];

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
    public album?: Nullable<Album>;

    @RelationId((item: Music) => item.album)
    public albumId?: Nullable<Album["id"]>;

    // Music[] => AlbumArt[]
    @Field(() => [AlbumArt])
    @ManyToMany(() => AlbumArt, item => item.musics, { cascade: true })
    @JoinTable()
    public albumArts!: AlbumArt[];

    @RelationId((item: Music) => item.albumArts)
    public albumArtIds!: AlbumArt["id"][];

    // Music => PlaylistRelation[]
    @OneToMany(() => PlaylistRelation, item => item.music)
    public playlistRelations!: PlaylistRelation[];

    @RelationId((item: Music) => item.playlistRelations)
    public playlistRelationIds!: PlaylistRelation["id"];
}
