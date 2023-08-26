import React from "react";
import { useTranslation } from "react-i18next";

import { VirtualizedList } from "ui";

import { Typography } from "@mui/material";

import { useLayout } from "@components/Layout/context";
import { Column, Item, Label, Root } from "@components/MusicList/index.styles";

import { MinimalMusic } from "@utils/types";
import { formatDuration } from "@utils/duration";

export interface MusicListProps {
    musics: MinimalMusic[];
}

export function MusicList({ musics }: MusicListProps) {
    const { t } = useTranslation();
    const { view } = useLayout();

    return (
        <Root>
            <VirtualizedList items={musics} estimateSize={() => 48} scrollElement={view}>
                {(item, index) => (
                    <Item odd={index % 2 !== 0} key={item.id}>
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
                )}
            </VirtualizedList>
        </Root>
    );
}
