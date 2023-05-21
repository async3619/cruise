import React from "react";
import { useTranslation } from "react-i18next";

import { Typography } from "@mui/material";

import { MinimalMusicFragment } from "@queries";

import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";

import { AlbumArt, Root } from "@components/MusicList.styles";

export interface MusicListProps {
    items: MinimalMusicFragment[];
}

export function MusicList({ items }: MusicListProps) {
    const { t } = useTranslation();

    return (
        <Root>
            <colgroup>
                <col />
                <col width="*" />
                <col style={{ width: "20%" }} />
                <col style={{ width: "20%" }} />
            </colgroup>
            <thead>
                <tr>
                    <th></th>
                    <th>
                        <Typography fontSize="0.9rem" color="text.disabled">
                            {t("tableColumn.music.title")}
                        </Typography>
                    </th>
                    <th>
                        <Typography fontSize="0.9rem" color="text.disabled">
                            {t("tableColumn.music.artist")}
                        </Typography>
                    </th>
                    <th>
                        <Typography fontSize="0.9rem" color="text.disabled">
                            {t("tableColumn.music.album")}
                        </Typography>
                    </th>
                </tr>
            </thead>
            <tbody>
                {items.map(item => (
                    <tr key={item.id}>
                        <td>
                            <AlbumArt
                                style={{
                                    backgroundImage: `url(cruise://${item.albumArts[0].path.replace(/\\/g, "/")})`,
                                }}
                            >
                                <PlayArrowRoundedIcon />
                            </AlbumArt>
                        </td>
                        <td>
                            <Typography fontSize="0.9rem">{item.title}</Typography>
                        </td>
                        <td>
                            <Typography fontSize="0.9rem">{item.albumArtist}</Typography>
                        </td>
                        <td>
                            <Typography fontSize="0.9rem">{item.album?.title}</Typography>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Root>
    );
}
