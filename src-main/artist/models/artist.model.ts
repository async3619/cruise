import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToMany,
    PrimaryGeneratedColumn,
    RelationId,
    UpdateDateColumn,
} from "typeorm";
import { Field, Int, ObjectType } from "type-graphql";

import { Music } from "@main/music/models/music.model";
import { Album } from "@main/album/models/album.model";

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
    @Field(() => [Music])
    @ManyToMany(() => Music, item => item.artists)
    public musics!: Music[];

    @RelationId((item: Artist) => item.musics)
    public musicIds!: Music["id"];

    // Artist[] => Album[]
    @Field(() => [Album])
    @ManyToMany(() => Album, item => item.artists)
    public albums!: Album[];

    @RelationId((item: Artist) => item.albums)
    public albumIds!: Album["id"][];
}
