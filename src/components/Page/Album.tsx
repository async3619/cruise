import * as _ from "lodash";
import React from "react";

import { Box, CircularProgress, Typography } from "@mui/material";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import ShuffleRoundedIcon from "@mui/icons-material/ShuffleRounded";

import AlbumArt from "@components/UI/AlbumArt";
import MusicList from "@components/UI/MusicList";
import Button from "@components/UI/Button";
import Page from "@components/Page";
import Placeholder from "@components/Placeholder";

import { ButtonContainer, Content, Information, Metadata, Root, Wrapper } from "@components/Page/Album.styles";

import formatDuration from "@utils/formatDuration";
import { reverseLerp } from "@utils/math";
import { AlbumType, Nullable, PlayableMusic } from "@utils/types";

export interface AlbumPageProps {
    album: Nullable<AlbumType>;
    onPlay(music: PlayableMusic): void;
    onPlayAll(): void;
    onShuffleAll(): void;
}
export interface AlbumPageStates {}

const MIN_ALBUM_ART_SIZE = 104;

export default class AlbumPage extends React.Component<AlbumPageProps, AlbumPageStates> {
    private readonly albumArtRef = React.createRef<HTMLDivElement>();
    private readonly informationRef = React.createRef<HTMLDivElement>();
    private albumArtHeight: number | null = null;
    private scrollY = 0;
    private frameId = 0;

    public componentDidMount() {
        this.frameId = window.requestAnimationFrame(this.handleFrame);
    }
    public componentWillUnmount() {
        window.cancelAnimationFrame(this.frameId);
    }

    private handleFrame = () => {
        this.frameId = window.requestAnimationFrame(this.handleFrame);
        if (!this.albumArtRef.current || !this.informationRef.current) {
            return;
        }

        if (this.albumArtHeight === null) {
            this.albumArtHeight = this.albumArtRef.current.clientHeight;
        }

        const size = Math.max(MIN_ALBUM_ART_SIZE, this.albumArtHeight - this.scrollY);
        const percent = reverseLerp(MIN_ALBUM_ART_SIZE, this.albumArtHeight, size);

        this.informationRef.current.style.opacity = `${1 - percent}`;

        this.albumArtRef.current.style.width = `${size}px`;
        this.albumArtRef.current.style.height = `${size}px`;
    };
    private handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        this.scrollY = e.currentTarget.scrollTop;
    };

    private renderMetadataItem = (content: string, index: number) => {
        return (
            <Typography key={index} variant="body1" noWrap overflow="hidden">
                {content}
            </Typography>
        );
    };
    private renderSkeleton = () => {
        return (
            <Root>
                <AlbumArt size={208} />
                <Box flex="1 1 auto" display="flex" alignItems="center" justifyContent="center">
                    <CircularProgress />
                </Box>
            </Root>
        );
    };
    private renderHeader = () => {
        const { album, onPlayAll, onShuffleAll } = this.props;
        if (!album) {
            return this.renderSkeleton();
        }

        const metadata: string[] = [];
        const albumArt = album.musics[0]?.albumArts[0];
        const artists = album.artists.map(artist => artist.name).join(", ");

        const years = _.chain(album.musics).map("year").uniq().compact().value();
        if (years.length > 0) {
            const minYear = Math.min(...years);
            const maxYear = Math.max(...years);

            if (minYear === maxYear) {
                metadata.push(minYear.toString());
            } else {
                metadata.push(`${minYear} - ${maxYear}`);
            }
        }

        metadata.push(`${album.musics.length} Tracks`);

        const totalDuration = _.chain(album.musics).map("duration").sum().value();
        metadata.push(formatDuration(totalDuration));

        return (
            <Wrapper>
                <Root>
                    <AlbumArt ref={this.albumArtRef} target={albumArt} size={208} />
                    <Content>
                        <Typography variant="h4" noWrap overflow="hidden" fontWeight={800}>
                            {album.title}
                        </Typography>
                        <Information ref={this.informationRef}>
                            <Typography variant="h6" noWrap overflow="hidden">
                                {artists}
                            </Typography>
                            <Metadata>{metadata.map(this.renderMetadataItem)}</Metadata>
                        </Information>
                        <Placeholder />
                        <ButtonContainer>
                            <Button color="primary" icon={PlayArrowRoundedIcon} onClick={onPlayAll}>
                                Play All
                            </Button>
                            <Button icon={ShuffleRoundedIcon} onClick={onShuffleAll}>
                                Shuffle All
                            </Button>
                        </ButtonContainer>
                    </Content>
                </Root>
            </Wrapper>
        );
    };
    public render() {
        const { album, onPlay } = this.props;

        return (
            <Page floatingHeader title="Album" header={this.renderHeader()} onScroll={this.handleScroll}>
                <Box pt={36} pb={2}>
                    {album && <MusicList items={album.musics} onPlay={onPlay} />}
                </Box>
            </Page>
        );
    }
}
