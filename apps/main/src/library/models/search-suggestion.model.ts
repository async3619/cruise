import { Field, Int, ObjectType, registerEnumType } from "@nestjs/graphql";

export enum SearchSuggestionType {
    Music = "Music",
    Album = "Album",
    Artist = "Artist",
}

registerEnumType(SearchSuggestionType, { name: "SearchSuggestionType" });

@ObjectType()
export class SearchSuggestion {
    @Field(() => Int)
    public id!: number;

    @Field(() => String)
    public title!: string;

    @Field(() => SearchSuggestionType)
    public type!: SearchSuggestionType;
}
