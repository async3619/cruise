import { Field, Int, ObjectType, registerEnumType } from "@nestjs/graphql";

export enum SearchSuggestionType {
    Artist = "artist",
    Album = "album",
    Music = "music",
}

registerEnumType(SearchSuggestionType, { name: "SearchSuggestionType" });

@ObjectType()
export class SearchSuggestion {
    @Field(() => Int)
    public id!: number;

    @Field(() => SearchSuggestionType)
    public type!: SearchSuggestionType;

    @Field(() => String)
    public name!: string;
}
