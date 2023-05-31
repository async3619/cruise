import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    RelationId,
    UpdateDateColumn,
} from "typeorm";
import { Field, Int, ObjectType } from "@nestjs/graphql";

import { Music } from "@main/music/models/music.model";
import { Album } from "@main/album/models/album.model";
import { AlbumArt } from "@main/album-art/models/album-art.model";

@ObjectType("Artist")
@Entity({ name: "artists" })
export class Artist extends BaseEntity {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    public id!: number;

    @Field(() => String)
    @Column({ type: "text" })
    public name!: string;

    @Field(() => Date)
    @CreateDateColumn()
    public createdAt!: Date;

    @Field(() => Date)
    @UpdateDateColumn()
    public updatedAt!: Date;

    // Artist[] => Music[]
    @ManyToMany(() => Music, item => item.albumArtists)
    public albumMusics!: Music[];

    @RelationId((item: Artist) => item.albumMusics)
    public albumMusicIds!: Music["id"];

    // Artist[] => Music[]
    @Field(() => [Music])
    @ManyToMany(() => Music, item => item.artists)
    public musics!: Music[];

    @RelationId((item: Artist) => item.musics)
    public musicIds!: Music["id"][];

    // Artist[] => Album[]
    @Field(() => [Album])
    @ManyToMany(() => Album, item => item.artists)
    public albums!: Album[];

    @RelationId((item: Artist) => item.albums)
    public albumIds!: Album["id"][];

    // Artist[] => Album[]
    @Field(() => [Album])
    @ManyToMany(() => Album, item => item.artists)
    public leadAlbums!: Album[];

    @RelationId((item: Artist) => item.leadAlbums)
    public leadAlbumIds!: Album["id"][];

    // Artist => AlbumArt
    @OneToOne(() => AlbumArt)
    @JoinColumn()
    public portrait!: AlbumArt;

    @RelationId((item: Artist) => item.portrait)
    public portraitId!: AlbumArt["id"];
}
