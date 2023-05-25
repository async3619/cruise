import { Entity, BaseEntity, PrimaryGeneratedColumn, RelationId, OneToMany, Column } from "typeorm";
import { Field, ObjectType, Int } from "@nestjs/graphql";

import { PlaylistRelation } from "@main/playlist/models/playlist-relation.model";

@Entity({ name: "playlists" })
@ObjectType()
export class Playlist extends BaseEntity {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    public id!: number;

    @Field(() => String)
    @Column({ type: "text" })
    public name!: string;

    // Playlist => PlaylistRelation[]
    @OneToMany(() => PlaylistRelation, item => item.playlist)
    public playlistRelations!: PlaylistRelation[];

    @RelationId((item: Playlist) => item.playlistRelations)
    public playlistRelationIds!: PlaylistRelation["id"][];
}
