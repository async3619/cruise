import { ConfigDataFragment, MinimalAlbumArtFragment, MinimalMusicFragment } from "@graphql/queries";

export type FromGraphQL<T> = T extends { __typename: any } ? Omit<T, "__typename"> : T;

export type ConfigData = ConfigDataFragment;

export type MinimalMusic = FromGraphQL<MinimalMusicFragment>;
export type MinimalAlbumArt = FromGraphQL<MinimalAlbumArtFragment>;
