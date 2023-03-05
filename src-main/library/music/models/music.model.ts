import { BaseEntity, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Field, Int, ObjectType } from "type-graphql";

@ObjectType("Music")
@Entity({ name: "musics" })
export class Music extends BaseEntity {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    public id!: number;
}
