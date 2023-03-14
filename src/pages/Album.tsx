import * as _ from "lodash";
import React from "react";

import { Typography } from "@mui/material";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import ShuffleRoundedIcon from "@mui/icons-material/ShuffleRounded";

import ShrinkHeaderPage from "@components/Page/ShrinkHeader";
import Button from "@components/UI/Button";
import MusicList from "@components/UI/MusicList";
import DotList from "@components/UI/DotList";

import { AlbumArtType, AlbumComponent, AlbumQuery, AlbumQueryResult } from "@queries";

import withParams, { WithParamsProps } from "@utils/hocs/withParams";
import withPlayer, { WithPlayerProps } from "@player/withPlayer";
import { AlbumType, PlayableMusic } from "@utils/types";
import formatDuration from "@utils/formatDuration";

export interface AlbumProps extends WithParamsProps<{ albumId: string }>, WithPlayerProps {}
export interface AlbumStates {
    musics: PlayableMusic[] | null;
    metadata: string[];
}

class Album extends React.Component<AlbumProps> {
    public state: AlbumStates = {
        musics: null,
        metadata: [],
    };

    private getMusics = () => {
        const { musics } = this.state;
        if (!musics) {
            throw new Error("Musics not found");
        }

        return musics;
    };

    private handleQueryCompleted = (query: AlbumQuery) => {
        if (!query.album) {
            throw new Error("Album not found");
        }

        const album = query.album;
        const metadata: string[] = [];
        const musicYears = _.chain(album.musics).map("year").uniq().compact().value();
        if (musicYears.length === 1) {
            metadata.push(musicYears[0].toString());
        } else if (musicYears.length > 1) {
            const minYear = _.min(musicYears);
            const maxYear = _.max(musicYears);

            metadata.push(`${minYear} - ${maxYear}`);
        }

        const musicGenres = _.chain(album.musics).map("genres").flatten().uniq().compact().value();
        if (musicGenres.length > 0) {
            metadata.push(musicGenres.join(", "));
        }

        metadata.push(`${album.musics.length} Tracks`);

        const durations = album.musics.map(music => music.duration);
        const totalDuration = _.sum(durations);

        metadata.push(formatDuration(totalDuration));

        this.setState({ musics: query.album.musics, metadata });
    };

    private handlePlayMusic = (music: PlayableMusic) => {
        const musics = this.getMusics();
        this.props.player.play(musics, music).then();
    };
    private handlePlayAll = () => {
        const musics = this.getMusics();
        this.props.player.play(musics, musics[0]).then();
    };
    private handleShuffleAll = () => {
        const musics = this.getMusics();
        this.props.player.playShuffled(musics).then();
    };

    private renderContent = (album: AlbumType) => {
        const { metadata } = this.state;

        const artists = album.leadArtists.map(artist => artist.name).join(", ");

        return (
            <>
                <Typography variant="h6" gutterBottom>
                    {artists}
                </Typography>
                <DotList items={metadata} variant="body1" color="text.secondary" />
            </>
        );
    };
    private renderButtons = () => {
        return (
            <>
                <Button color="primary" icon={PlayArrowRoundedIcon} onClick={this.handlePlayAll}>
                    Play All
                </Button>
                <Button icon={ShuffleRoundedIcon} onClick={this.handleShuffleAll}>
                    Shuffle All
                </Button>
            </>
        );
    };
    private renderBody = ({ data, loading }: AlbumQueryResult) => {
        if (loading) {
            return <ShrinkHeaderPage loading />;
        }

        if (!data?.album) {
            throw new Error("Album not found");
        }

        const { player } = this.props;
        const album = data.album;
        const albumArts = album.musics.flatMap(music => music.albumArts);
        const albumArt = albumArts.find(art => art.type === AlbumArtType.CoverFront) || albumArts[0];
        const imagePath = albumArt ? `cruise://${albumArt.path}` : undefined;

        return (
            <ShrinkHeaderPage
                title={album.title}
                image={imagePath}
                buttons={this.renderButtons()}
                content={this.renderContent(album)}
            >
                <MusicList items={album.musics} onPlay={this.handlePlayMusic} activeItem={player.currentMusic} />
            </ShrinkHeaderPage>
        );
    };

    public render() {
        const { params } = this.props;
        if (!params.albumId) {
            throw new Error("Album ID is required");
        }

        const id = Number(params.albumId);
        if (isNaN(id)) {
            throw new Error("Album ID must be a number");
        }

        return (
            <AlbumComponent onCompleted={this.handleQueryCompleted} variables={{ id }}>
                {this.renderBody}
            </AlbumComponent>
        );
    }
}

export default withPlayer(withParams(Album));
