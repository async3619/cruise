import { MusicsQuery, PlayableMusicFragment } from "@queries";

export type SelectOnly<Record, Type extends Record[keyof Record]> = {
    [Key in keyof Required<Record> as Required<Record>[Key] extends Type ? Key : never]: Record[Key];
};

export type ValueOf<Record> = Record[keyof Record];
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

export type IsUnion<T> = [T] extends [UnionToIntersection<T>] ? false : true;

export type UnionOnly<Record> = {
    [Key in keyof Required<Record> as IsUnion<Required<Record>[Key]> extends true ? Key : never]: Record[Key];
};

export type ReplaceUnions<Record> = {
    [Key in keyof Required<Record>]: IsUnion<Required<Record>[Key]> extends true ? string : Required<Record>[Key];
};

export type Nullable<T> = T | null | undefined;

export type MusicListItem = MusicsQuery["musics"][0];
export type PlayableMusic = PlayableMusicFragment;
