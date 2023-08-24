import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, RelationId } from "typeorm";
import { Field, Int, ObjectType } from "@nestjs/graphql";

import { Music } from "@music/models/music.model";

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
    public artists!: string[];

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
}
