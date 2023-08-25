import { BaseEntity, Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn, RelationId } from "typeorm";
import { Field, Int, ObjectType } from "@nestjs/graphql";

import { Music } from "@music/models/music.model";
import { Album } from "@album/models/album.model";

@Entity({ name: "artists" })
@ObjectType()
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
    @CreateDateColumn()
    public updatedAt!: Date;

    // Artist[] => Music[]
    @ManyToMany(() => Music, item => item.artists)
    public musics!: Music[];

    @RelationId((item: Artist) => item.musics)
    public musicIds!: Music["id"][];

    // Artist[] => Album[]
    @ManyToMany(() => Album, item => item.artists)
    public albums!: Album[];

    @RelationId((item: Artist) => item.albums)
    public albumIds!: Album["id"][];
}
