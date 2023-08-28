import {
    Entity,
    BaseEntity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    RelationId,
    ManyToMany,
    JoinTable,
} from "typeorm";
import { Field, ObjectType, Int } from "@nestjs/graphql";

import { Music } from "@music/models/music.model";

@Entity({ name: "playlists" })
@ObjectType()
export class Playlist extends BaseEntity {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    public id!: number;

    @Field(() => String)
    @Column({ type: "varchar", length: 255 })
    public name!: string;

    @Field(() => Date)
    @CreateDateColumn()
    public createdAt!: Date;

    @Field(() => Date)
    @CreateDateColumn()
    public updatedAt!: Date;

    // Playlists[] => Music[]
    @ManyToMany(() => Music, item => item.playlists)
    @JoinTable()
    public musics!: Music[];

    @RelationId((item: Playlist) => item.musics)
    public musicIds!: Music["id"][];
}
