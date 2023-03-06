import React from "react";
import memoizeOne from "memoize-one";

import { Typography } from "@mui/material";

import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";

import SquaredIconButton from "@components/UI/SquaredIconButton";
import { Column, Controls, Root, Row } from "@components/UI/MusicList.styles";

import { MusicListItem } from "@utils/types";

export interface MusicListProps {
    items: MusicListItem[];
    onPlay(item: MusicListItem): void;
}
export interface MusicListStates {}

export default class MusicList extends React.Component<MusicListProps, MusicListStates> {
    private handlePlay = memoizeOne((item: MusicListItem) => () => this.props.onPlay(item));

    private renderRow = (item: MusicListItem) => {
        const durationMinute = Math.floor(item.duration / 60);
        const durationSecond = (item.duration % 60).toString().padStart(2, "0");
        const duration = `${durationMinute}:${durationSecond}`;
        const artists = (item.album?.artists || item.artists).map(artist => artist.name).join(", ");

        return (
            <Row key={item.id}>
                <Column withoutPadding>
                    <Controls>
                        <SquaredIconButton onClick={this.handlePlay(item)}>
                            <PlayArrowRoundedIcon />
                        </SquaredIconButton>
                    </Controls>
                </Column>
                <Column>
                    <Typography variant="body1" fontSize="0.9rem">
                        {item.title}
                    </Typography>
                </Column>
                <Column>
                    <Typography variant="body1" fontSize="0.9rem">
                        {artists}
                    </Typography>
                </Column>
                <Column>
                    <Typography variant="body1" fontSize="0.9rem">
                        {item.album?.title || "Unknown Album"}
                    </Typography>
                </Column>
                <Column shrink>
                    <Typography variant="body1" fontSize="0.9rem">
                        {item.year}
                    </Typography>
                </Column>
                <Column>
                    <Typography variant="body1" fontSize="0.9rem">
                        {item.genre || "Unknown Genre"}
                    </Typography>
                </Column>
                <Column shrink>
                    <Typography variant="body1" fontSize="0.9rem">
                        {duration}
                    </Typography>
                </Column>
            </Row>
        );
    };
    public render() {
        const { items } = this.props;

        return (
            <Root>
                <colgroup>
                    <col width="50px" />
                    <col width="*" />
                    <col width="20%" />
                    <col width="17.5%" />
                    <col width="65px" />
                    <col width="15%" />
                    <col width="65px" />
                </colgroup>
                {items.map(this.renderRow)}
            </Root>
        );
    }
}
