import {
    AlbumArtType as AlbumArtTypeImpl,
    AlbumQuery,
    AlbumsQuery,
    ArtistAlbumsQuery,
    ArtistNamesQuery,
    ArtistsQuery,
    MinimalAlbumArtFragment,
    MusicsQuery,
    PlayableMusicFragment,
} from "@queries";

export type SelectOnly<Record, Type> = {
    [Key in keyof Required<Record> as Required<Record>[Key] extends Type ? Key : never]: Required<Record>[Key];
};

export type ValueOf<Record> = Record[keyof Record];
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

export type IsUnion<T> = [T] extends [UnionToIntersection<T>] ? false : true;

export type UnionOnly<Record> = {
    [Key in keyof Required<Record> as IsUnion<Required<Record>[Key]> extends true ? Key : never]: Required<Record>[Key];
};

export type ReplaceUnions<Record> = {
    [Key in keyof Required<Record>]: IsUnion<Required<Record>[Key]> extends true ? string : Required<Record>[Key];
};

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
export type ArtistPageData = Required<ArtistAlbumsQuery["artist"]>;
export type ArtistAlbumListItem = ArtistPageData["albums"][0];
export type ArtistNamesItem = ArtistNamesQuery["artists"][0];
