import { Field, Int, ObjectType, registerEnumType } from "@nestjs/graphql";
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

import { Music } from "@main/music/models/music.model";
import { Album } from "@main/album/models/album.model";

export enum AlbumArtType {
    Other = 0,
    Icon = 1,
    OtherIcon = 2,
    CoverFront = 3,
    CoverBack = 4,
    Leaflet = 5,
    Media = 6,
    LeadArtist = 7,
    Artist = 8,
    Conductor = 9,
    Band = 10,
    Composer = 11,
    Lyricist = 12,
    RecordingLocation = 13,
    DuringRecording = 14,
    DuringPerformance = 15,
    ScreenCapture = 16,
    BrightFish = 17,
    Illustration = 18,
    BandLogo = 19,
    PublisherLogo = 20,
    Undefined = 21,
}

registerEnumType(AlbumArtType, { name: "AlbumArtType" });

@ObjectType("AlbumArt")
@Entity({ name: "album-arts" })
export class AlbumArt extends BaseEntity {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    public id!: number;

    @Field(() => AlbumArtType)
    @Column({ type: "int" })
    public type!: AlbumArtType;

    @Field(() => String)
    @Column({ type: "text" })
    public mimeType!: string;

    @Field(() => String)
    @Column({ type: "text" })
    public description!: string;

    @Field(() => Int)
    @Column({ type: "integer" })
    public width!: number;

    @Field(() => Int)
    @Column({ type: "integer" })
    public height!: number;

    @Field(() => Int)
    @Column({ type: "integer" })
    public size!: number;

    @Field(() => String)
    @Column({ type: "text" })
    public path!: string;

    @Field(() => String)
    @Column({ type: "text" })
    public checksum!: string;

    @Field(() => Date)
    @CreateDateColumn()
    public createdAt!: Date;

    @Field(() => Date)
    @UpdateDateColumn()
    public updatedAt!: Date;

    // AlbumArt[] => Music[]
    @ManyToMany(() => Music, item => item.albumArts)
    public musics!: Music[];

    @RelationId((item: AlbumArt) => item.musics)
    public musicIds!: Music["id"][];

    // AlbumArt[] => Album[]
    @ManyToMany(() => Album, item => item.albumArts)
    public albums!: Album[];

    @RelationId((item: AlbumArt) => item.albums)
    public albumIds!: Album["id"];
}
