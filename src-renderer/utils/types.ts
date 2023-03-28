import type { NavigateFunction } from "react-router-dom";
import { PlayerContextValue } from "@player/context";
import { LibraryContextValue } from "@library/context";
import { DialogContextValue } from "@dialogs";
import { ApolloClient } from "@apollo/client";
import {
    AlbumArtItemFragment,
    AlbumArtType as AlbumArtTypeImpl,
    AlbumQuery,
    AlbumsQuery,
    ArtistAlbumsQuery,
    ArtistNamesQuery,
    ArtistsQuery,
    ConfigQuery,
    MinimalAlbumArtFragment,
    MusicsQuery,
    PlayableMusicFragment,
} from "@queries";

export type SelectOnly<Record, Type> = {
    [Key in keyof Required<Record> as Required<Record>[Key] extends Type ? Key : never]: Required<Record>[Key];
};

export type ValueOf<Record> = Record[keyof Record];

export type Nullable<T> = T | null | undefined;
export type Required<T> = Exclude<T, null | undefined>;
export type Fn<TArgs = void, TReturn = void> = TArgs extends void
    ? () => TReturn
    : TArgs extends any[]
    ? (...args: TArgs) => TReturn
    : (args: TArgs) => TReturn;
export type IsEmpty<TRecord, TTrue, TFalse> = keyof TRecord extends never ? TTrue : TFalse;

export type MusicListItem = MusicsQuery["musics"][0];
export type AlbumListItem = AlbumsQuery["albums"][0];
export type ArtistListItem = ArtistsQuery["artists"][0];
export type PlayableMusic = PlayableMusicFragment;
export type AlbumArtType = AlbumArtTypeImpl;
export type AlbumType = Required<AlbumQuery["album"]>;
export type MinimumAlbumArt = MinimalAlbumArtFragment;
export type ArtistAlbumListItem = ArtistAlbumsQuery["leadAlbumsByArtist"][0];
export type ArtistPageData = {
    artist: Required<ArtistAlbumsQuery["artist"]>;
    albums: ArtistAlbumListItem[];
};
export type ArtistNamesItem = ArtistNamesQuery["artists"][0];
export type AlbumArtItem = AlbumArtItemFragment;
export type Config = ConfigQuery["config"];

export interface BasePageProps<TParams extends Record<string, string> = Record<string, never>> {
    client: ApolloClient<object>;
    player: PlayerContextValue;
    dialog: DialogContextValue;
    params: TParams;
    navigate: NavigateFunction;
    library: LibraryContextValue;
}
