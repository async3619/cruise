import { Nullable } from "@common/types";
import { ArtistIdNameFragment } from "@queries";

export function formatArtistName(artist?: Nullable<ArtistIdNameFragment> | ArtistIdNameFragment[]): string {
    if (Array.isArray(artist)) {
        if (artist.length === 0) {
            return "Unknown Artist";
        }

        return artist.map(a => formatArtistName(a)).join(", ");
    }

    if (!artist) {
        return "Unknown Artist";
    }

    return artist.name;
}
