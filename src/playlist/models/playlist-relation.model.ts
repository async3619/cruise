import { Entity, BaseEntity, PrimaryGeneratedColumn, ManyToOne, RelationId } from "typeorm";
import { Field, ObjectType, Int } from "@nestjs/graphql";

import { Music } from "@main/music/models/music.model";
import { Playlist } from "@main/playlist/models/playlist.model";

@Entity({ name: "playlist-relations" })
@ObjectType()
export class PlaylistRelation extends BaseEntity {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    public id!: number;

    // PlaylistRelation[] => Music
    @ManyToOne(() => Music, item => item.playlistRelations)
    public music!: Music;

    @RelationId((item: PlaylistRelation) => item.music)
    public musicId!: Music["id"];

    // PlaylistRelation[] => Playlist
    @ManyToOne(() => Playlist, item => item.playlistRelations)
    public playlist!: Playlist;

    @RelationId((item: PlaylistRelation) => item.playlist)
    public playlistId!: Playlist["id"];
}
