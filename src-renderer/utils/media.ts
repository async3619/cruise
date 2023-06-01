import { MinimalAlbumFragment, MinimalMusicFragment } from "@queries";

export function getMusics(album: MinimalAlbumFragment | MinimalAlbumFragment[]): MinimalMusicFragment[] {
    if (Array.isArray(album)) {
        return album.flatMap(a => a.musics);
    }

    return album.musics;
}

export function isAlbum(target: unknown): target is MinimalAlbumFragment {
    if (typeof target !== "object" || !target) {
        return false;
    }

    return "__typename" in target && target.__typename === "Album";
}
export function isAlbumArray(target: unknown): target is MinimalAlbumFragment[] {
    if (!Array.isArray(target)) {
        return false;
    }

    return target.every(isAlbum);
}

export function isMusic(target: unknown): target is MinimalMusicFragment {
    if (typeof target !== "object" || !target) {
        return false;
    }

    return "__typename" in target && target.__typename === "Music";
}
export function isMusicArray(target: unknown): target is MinimalMusicFragment[] {
    if (!Array.isArray(target)) {
        return false;
    }

    return target.every(isMusic);
}
