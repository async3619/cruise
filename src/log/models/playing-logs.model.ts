import { Entity, BaseEntity, PrimaryGeneratedColumn, RelationId, CreateDateColumn, ManyToOne } from "typeorm";
import { Field, ObjectType, Int } from "@nestjs/graphql";

import { Music } from "@main/music/models/music.model";

@Entity({ name: "playing-logs" })
@ObjectType()
export class PlayingLog extends BaseEntity {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    public id!: number;

    @CreateDateColumn()
    public createdAt!: Date;

    // PlayingLog[] => Music
    @Field(() => Music)
    @ManyToOne(() => Music, item => item.playingLogs)
    public music!: Music;

    @RelationId((item: PlayingLog) => item.music)
    public musicId!: Music["id"];
}
