import * as _ from "lodash";
import React from "react";

import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import ShuffleRoundedIcon from "@mui/icons-material/ShuffleRounded";

import ShrinkHeaderPage from "@components/Page/ShrinkHeader";
import AlbumList from "@components/UI/AlbumList";
import Button from "@components/UI/Button";

import withPlayer, { WithPlayerProps } from "@player/withPlayer";
import { ArtistAlbumsComponent, ArtistAlbumsQuery, ArtistAlbumsQueryResult } from "@queries";

import withParams, { WithParamsProps } from "@utils/hocs/withParams";
import { AlbumListItem, ArtistPageData } from "@utils/types";
import DotList from "@components/UI/DotList";
import mode from "@utils/mode";
import formatDuration from "@utils/formatDuration";

export interface ArtistProps extends WithParamsProps<{ artistId: string }>, WithPlayerProps {}
export interface ArtistStates {
    data: ArtistPageData | null;
    subtitleItems: string[];
    metadata: string[];
}

class Artist extends React.Component<ArtistProps, ArtistStates> {
    public state: ArtistStates = {
        data: null,
        metadata: [],
        subtitleItems: [],
    };

    private getData = () => {
        const { data } = this.state;
        if (!data) {
            throw new Error("Artist data not found");
        }

        return data;
    };

    private handleQueryCompleted = (data: ArtistAlbumsQuery) => {
        if (!data.artist) {
            throw new Error("Artist not found");
        }

        const metadata: string[] = ["Artist"];
        const allMusics = data.artist.albums.flatMap(a => a.musics);
        const genres = _.chain(allMusics).map("genre").flatten().uniq().compact().value();
        const mostFrequentGenre = mode(genres);
        if (mostFrequentGenre) {
            metadata.push(mostFrequentGenre);
        } else {
            metadata.push("Unknown Genre");
        }

        const totalDuration = _.chain(allMusics).map("duration").sum().value();
        const subtitleItems: string[] = [
            `${data.artist.albums.length} Albums`,
            `${allMusics.length} Musics`,
            formatDuration(totalDuration),
        ];

        this.setState({
            data: data.artist,
            metadata,
            subtitleItems,
        });
    };

    private handlePlayAll = () => {
        const data = this.getData();
        const { player } = this.props;

        player
            .play(
                data.albums.flatMap(a => a.musics),
                data.albums[0].musics[0],
            )
            .then();
    };
    private handleShuffleAll = () => {
        const data = this.getData();
        const { player } = this.props;

        const musics = data.albums.flatMap(a => a.musics);
        player.playShuffled(musics).then();
    };
    private handleAlbumPlay = (album: AlbumListItem) => {
        const data = this.getData();
        const targetAlbum = data.albums.find(a => a.id === album.id);
        if (!targetAlbum) {
            throw new Error("Album not found");
        }

        const { player } = this.props;
        player.play(targetAlbum.musics, targetAlbum.musics[0]);
    };
    private handleAlbumClick = (album: AlbumListItem) => {
        const { navigate } = this.props;

        navigate(`/albums/${album.id}`);
    };

    private renderContent = () => {
        const { subtitleItems, metadata } = this.state;

        return (
            <>
                <DotList items={subtitleItems} variant="h6" gutterBottom />
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
    private renderBody = ({ data, loading }: ArtistAlbumsQueryResult) => {
        if (loading) {
            return <ShrinkHeaderPage loading />;
        }

        if (!data || !data.artist) {
            throw new Error("Artist not found");
        }

        const albums = data.artist.albums;

        return (
            <ShrinkHeaderPage
                shape="circle"
                title={data.artist.name}
                buttons={this.renderButtons()}
                content={this.renderContent()}
            >
                <AlbumList
                    items={albums}
                    onPlay={this.handleAlbumPlay}
                    onClick={this.handleAlbumClick}
                    subtitleType="year"
                />
            </ShrinkHeaderPage>
        );
    };
    public render() {
        const { params } = this.props;
        if (!params.artistId) {
            throw new Error("Artist id not found");
        }

        const artistId = Number(params.artistId);
        if (isNaN(artistId)) {
            throw new Error("Artist id is not a number");
        }

        return (
            <ArtistAlbumsComponent onCompleted={this.handleQueryCompleted} variables={{ artistId }}>
                {this.renderBody}
            </ArtistAlbumsComponent>
        );
    }
}

export default withParams(withPlayer(Artist));
