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
} from "typeorm";
import { Field, Int, ObjectType } from "@nestjs/graphql";

import { Music } from "@music/models/music.model";
import { Artist } from "@artist/models/artist.model";
import { AlbumArt } from "@album-art/models/album-art.model";

@Entity({ name: "albums" })
@ObjectType()
export class Album extends BaseEntity {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    public id!: number;

    @Field(() => String)
    @Column({ type: "text" })
    public title!: string;

    @Field(() => [String])
    @Column({ type: "simple-array" })
    public artistNames!: string[];

    @Field(() => [String])
    @Column({ type: "simple-array" })
    public albumArtists!: string[];

    @Field(() => Date)
    @CreateDateColumn()
    public createdAt!: Date;

    @Field(() => Date)
    @CreateDateColumn()
    public updatedAt!: Date;

    // Album => Music[]
    @OneToMany(() => Music, item => item.album)
    public musics!: Music[];

    @RelationId((item: Album) => item.musics)
    public musicIds!: Music["id"][];

    // Album[] => Artist[]
    @ManyToMany(() => Artist, item => item.albums)
    @JoinTable()
    public artists!: Artist[];

    @RelationId((item: Album) => item.artists)
    public artistIds!: Artist["id"][];

    // Album => AlbumArt[]
    @OneToMany(() => AlbumArt, item => item.album)
    public albumArts!: AlbumArt[];

    @RelationId((item: Album) => item.albumArts)
    public albumArtIds!: AlbumArt["id"][];
}
