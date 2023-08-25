import React from "react";
import { useTranslation } from "react-i18next";

import { Typography } from "@mui/material";

import { Column, Item, Label, Root } from "@components/MusicList/index.styles";

import { MinimalMusic } from "@utils/types";
import { formatDuration } from "@utils/duration.ts";

export interface MusicListProps {
    musics: MinimalMusic[];
}

export function MusicList({ musics }: MusicListProps) {
    const { t } = useTranslation();

    return (
        <Root>
            {musics.map(item => (
                <Item key={item.id}>
                    <Column width="43%">
                        <Typography component={Label} variant="body1" fontSize="0.9rem">
                            {item.title}
                        </Typography>
                    </Column>
                    <Column width="18%">
                        <Typography component={Label} variant="body1" fontSize="0.9rem">
                            {item.artists[0].name}
                        </Typography>
                    </Column>
                    <Column width="18%">
                        <Typography component={Label} variant="body1" fontSize="0.9rem">
                            {item.album?.title || "Unknown"}
                        </Typography>
                    </Column>
                    <Column width="18%">
                        <Typography component={Label} variant="body1" fontSize="0.9rem">
                            {item.genre[0] || t("common.unknown-genre")}
                        </Typography>
                    </Column>
                    <Column width="7%">
                        <Typography component={Label} variant="body1" fontSize="0.9rem" textAlign="right">
                            {formatDuration(item.duration)}
                        </Typography>
                    </Column>
                </Item>
            ))}
        </Root>
    );
}
