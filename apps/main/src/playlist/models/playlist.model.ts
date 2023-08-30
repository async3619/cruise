import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";
import { Field, ObjectType, Int } from "@nestjs/graphql";

@Entity({ name: "playlists" })
@ObjectType()
export class Playlist extends BaseEntity {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    public id!: number;

    @Field(() => String)
    @Column({ type: "varchar", length: 255 })
    public name!: string;

    @Field(() => [Int])
    @Column({ type: "simple-array" })
    public musicIds!: number[];

    @Field(() => Date)
    @CreateDateColumn()
    public createdAt!: Date;

    @Field(() => Date)
    @CreateDateColumn()
    public updatedAt!: Date;
}
