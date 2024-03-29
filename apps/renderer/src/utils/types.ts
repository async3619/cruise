import {
    ConfigDataFragment,
    FullArtistFragment,
    FullSearchResultFragment,
    FullSearchSuggestionFragment,
    MinimalAlbumArtFragment,
    MinimalAlbumFragment,
    MinimalArtistFragment,
    MinimalMusicFragment,
    MinimalPlaylistFragment,
} from "@graphql/queries";

export type FromGraphQL<T> = T extends { __typename: any } ? Omit<T, "__typename"> : T;

export type ConfigData = ConfigDataFragment;

export type MinimalMusic = FromGraphQL<MinimalMusicFragment>;
export type MinimalAlbumArt = FromGraphQL<MinimalAlbumArtFragment>;
export type MinimalPlaylist = FromGraphQL<MinimalPlaylistFragment>;
export type MinimalAlbum = FromGraphQL<MinimalAlbumFragment>;
export type MinimalArtist = FromGraphQL<MinimalArtistFragment>;
export type FullArtist = FromGraphQL<FullArtistFragment>;
export type SearchSuggestionItem = FromGraphQL<FullSearchSuggestionFragment>;
export type SearchResult = FromGraphQL<FullSearchResultFragment>;
