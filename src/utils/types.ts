import {
    MusicsQuery,
    PlayableMusicFragment,
    AlbumArtType as AlbumArtTypeImpl,
    AlbumsQuery,
    AlbumQuery,
    MinimalAlbumArtFragment,
} from "@queries";

export type SelectOnly<Record, Type extends Record[keyof Record]> = {
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

export type MusicListItem = MusicsQuery["musics"][0];
export type AlbumListItem = AlbumsQuery["albums"][0];
export type PlayableMusic = PlayableMusicFragment;
export type AlbumArtType = AlbumArtTypeImpl;
export type AlbumType = Required<AlbumQuery["album"]>;
export type MinimumAlbumArt = MinimalAlbumArtFragment;
