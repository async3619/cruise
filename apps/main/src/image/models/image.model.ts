import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, RelationId, OneToMany } from "typeorm";
import { Field, ObjectType, Int } from "@nestjs/graphql";

import { AlbumArt } from "@album-art/models/album-art.model";

@Entity({ name: "images" })
@ObjectType()
export class Image extends BaseEntity {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    public id!: number;

    @Field(() => String)
    @Column({ type: "text" })
    public path!: string;

    @Field(() => String)
    @Column({ type: "text" })
    public hash!: string;

    @Field(() => Int)
    @Column({ type: "int" })
    public width!: number;

    @Field(() => Int)
    @Column({ type: "int" })
    public height!: number;

    @Field(() => Int)
    @Column({ type: "int" })
    public size!: number;

    @Field(() => String)
    @Column({ type: "text" })
    public format!: string;

    @Field(() => String)
    @Column({ type: "text" })
    public mimeType!: string;

    @Field(() => String)
    @Column({ type: "text" })
    public bucketName!: string;

    @Field(() => Date)
    @CreateDateColumn()
    public createdAt!: Date;

    @Field(() => Date)
    @CreateDateColumn()
    public updatedAt!: Date;

    // Image => AlbumArt[]
    @OneToMany(() => AlbumArt, item => item.image)
    public albumArts!: AlbumArt[];

    @RelationId((item: Image) => item.albumArts)
    public albumArtIds!: AlbumArt["id"][];
}
