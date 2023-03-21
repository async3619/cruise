import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
    RelationId,
    UpdateDateColumn,
} from "typeorm";
import { Field, Int, ObjectType } from "@nestjs/graphql";

import { Music } from "@main/music/models/music.model";
import { Artist } from "@main/artist/models/artist.model";
import { AlbumArt } from "@main/album-art/models/album-art.model";

@ObjectType("Album")
@Entity({ name: "albums" })
export class Album extends BaseEntity {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    public id!: number;

    @Field(() => String)
    @Column({ type: "text" })
    public title!: string;

    @Field(() => Date)
    @CreateDateColumn()
    public createdAt!: Date;

    @Field(() => Date)
    @UpdateDateColumn()
    public updatedAt!: Date;

    // Album => Music[]
    @Field(() => [Music])
    @OneToMany(() => Music, item => item.album)
    public musics!: Music[];

    @RelationId((item: Album) => item.musics)
    public musicIds!: Music["id"][];

    // Album[] => Artist[]
    @Field(() => [Artist])
    @ManyToMany(() => Artist, item => item.albums)
    @JoinTable()
    public artists!: Artist[];

    @RelationId((item: Album) => item.artists)
    public artistIds!: Artist["id"][];

    // Album[] => Artist[]
    @Field(() => [Artist])
    @ManyToMany(() => Artist, item => item.albums)
    @JoinTable()
    public leadArtists!: Artist[];

    @RelationId((item: Album) => item.leadArtists)
    public leadArtistIds!: Artist["id"][];

    // Album[] => AlbumArt[]
    @Field(() => [AlbumArt])
    @ManyToMany(() => AlbumArt, item => item.albums)
    @JoinTable()
    public albumArts!: AlbumArt[];

    @RelationId((item: Album) => item.albumArts)
    public albumArtIds!: AlbumArt["id"][];
}
