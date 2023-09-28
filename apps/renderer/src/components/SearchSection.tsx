import React from "react";

import { Box, Button, Typography } from "@mui/material";

import { MusicList } from "@components/MusicList";
import { AlbumArtistList } from "@components/AlbumArtist/List";

import { FullArtist, MinimalAlbum, MinimalMusic } from "@utils/types";
import { useTranslation } from "react-i18next";

export interface BaseSearchSectionProps {
    title: string;
    count: number;
    maxCount?: number;
    onShowMore?(): void;
}

export interface MusicSearchSectionProps extends BaseSearchSectionProps {
    type: "music";
    items: MinimalMusic[];
}

export interface ArtistSearchSectionProps extends BaseSearchSectionProps {
    type: "artist";
    items: FullArtist[];
    onPlayItem: (item: FullArtist) => void;
}

export interface AlbumSearchSectionProps extends BaseSearchSectionProps {
    type: "album";
    items: MinimalAlbum[];
    onPlayItem: (item: MinimalAlbum) => void;
}

export type SearchSectionProps = MusicSearchSectionProps | ArtistSearchSectionProps | AlbumSearchSectionProps;

export function SearchSection(props: SearchSectionProps) {
    const { title, count, maxCount = props.items.length, onShowMore } = props;
    const { t } = useTranslation();
    const items = React.useMemo(() => props.items.slice(0, maxCount), [maxCount, props.items]);

    return (
        <Box>
            <Box height={36} display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="h6" lineHeight={1}>
                    {title} ({count})
                </Typography>
                {count > maxCount && (
                    <Button size="small" onClick={onShowMore}>
                        {t("common.show-more")}
                    </Button>
                )}
            </Box>
            <Box mt={1}>
                {props.type === "music" && <MusicList musics={items as MinimalMusic[]} />}
                {props.type === "album" && (
                    <AlbumArtistList type="album" items={items as MinimalAlbum[]} onPlayItem={props.onPlayItem} />
                )}
                {props.type === "artist" && (
                    <AlbumArtistList type="artist" items={items as FullArtist[]} onPlayItem={props.onPlayItem} />
                )}
            </Box>
        </Box>
    );
}
