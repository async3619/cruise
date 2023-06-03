import { SearchSuggestion } from "@main/library/models/search-suggestion.dto";

export interface Searchable<T> {
    search(query: string): Promise<T[]>;
    getSuggestions(query: string): Promise<SearchSuggestion[]>;
}
