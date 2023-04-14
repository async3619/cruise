import * as _ from "lodash";
import React from "react";

import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import ShuffleRoundedIcon from "@mui/icons-material/ShuffleRounded";

import ShrinkHeaderPage from "@components/Page/ShrinkHeader";
import AlbumList from "@components/UI/AlbumList";
import Button from "@components/UI/Button";
import DotList from "@components/UI/DotList";

import {
    AlbumAddedComponent,
    AlbumAddedSubscription,
    AlbumRemovedComponent,
    AlbumRemovedSubscription,
    AlbumsUpdatedComponent,
    AlbumsUpdatedSubscription,
    ArtistAlbumsComponent,
    ArtistAlbumsQuery,
    ArtistAlbumsQueryResult,
    ArtistPortraitAddedComponent,
    ArtistPortraitAddedSubscription,
} from "@queries";

import formatDuration from "@utils/formatDuration";
import mode from "@utils/mode";
import { AlbumListItem, ArtistPageData, BasePageProps } from "@utils/types";
import { OnDataOptions } from "@apollo/client";

export interface ArtistProps extends BasePageProps {}
export interface ArtistStates {
    data: ArtistPageData | null;
    subtitleItems: string[];
    metadata: string[];
}

export default class Artist extends React.Component<ArtistProps, ArtistStates> {
    private refetch: ArtistAlbumsQueryResult["refetch"] | null = null;
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
        const allMusics = data.leadAlbumsByArtist.flatMap(a => a.musics);
        const genres = _.chain(allMusics).map("genre").flatten().uniq().compact().value();
        const mostFrequentGenre = mode(genres);
        if (mostFrequentGenre) {
            metadata.push(mostFrequentGenre);
        } else {
            metadata.push("Unknown Genre");
        }

        const musicCount = _.chain(data.leadAlbumsByArtist)
            .map(a => a.musics.length)
            .sum()
            .value();
        const totalDuration = _.chain(allMusics).map("duration").sum().value();
        const subtitleItems: string[] = [
            `${data.leadAlbumsByArtist.length} Albums`,
            `${musicCount} Musics`,
            formatDuration(totalDuration),
        ];

        this.setState({
            data: {
                artist: data.artist,
                albums: data.leadAlbumsByArtist,
            },
            metadata,
            subtitleItems,
        });
    };

    private handleAlbumRemoved = async ({ data: { data } }: OnDataOptions<AlbumRemovedSubscription>) => {
        const { data: prevState } = this.state;
        if (!prevState || !data) {
            return;
        }

        this.handleQueryCompleted({
            artist: prevState.artist,
            leadAlbumsByArtist: prevState.albums.filter(a => a.id !== data.albumRemoved),
        });
    };
    private handleAlbumAdded = async ({ data: { data } }: OnDataOptions<AlbumAddedSubscription>) => {
        const { data: prevState } = this.state;
        if (!prevState || !data) {
            return;
        }

        this.handleQueryCompleted({
            artist: prevState.artist,
            leadAlbumsByArtist: [...prevState.albums, data.albumAdded],
        });
    };
    private handleAlbumsUpdated = async ({ data: { data } }: OnDataOptions<AlbumsUpdatedSubscription>) => {
        const { data: prevState } = this.state;
        if (!prevState || !data) {
            return;
        }

        const updatedAlbumMap = _.keyBy(data.albumsUpdated, "id");
        const updatedAlbums = prevState.albums.map(a => updatedAlbumMap[a.id] || a);

        this.handleQueryCompleted({
            artist: prevState.artist,
            leadAlbumsByArtist: updatedAlbums,
        });
    };
    private handlePortraitAdded = async ({ data: { data } }: OnDataOptions<ArtistPortraitAddedSubscription>) => {
        const { data: prevState } = this.state;
        if (!prevState || !data) {
            return;
        }

        this.handleQueryCompleted({
            artist: {
                ...prevState.artist,
                portrait: data.artistPortraitAdded.portrait,
            },
            leadAlbumsByArtist: prevState.albums,
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
    private renderBody = ({ loading, refetch }: ArtistAlbumsQueryResult) => {
        if (loading) {
            return <ShrinkHeaderPage loading />;
        }

        const { data } = this.state;
        if (!data || !data.artist) {
            throw new Error("Artist not found");
        }

        this.refetch = refetch;

        const imageUrl = data.artist.portrait ? `cruise://${data.artist.portrait.path}` : undefined;

        return (
            <ShrinkHeaderPage
                shape="circle"
                title={data.artist.name}
                buttons={this.renderButtons()}
                content={this.renderContent()}
                image={imageUrl}
            >
                <AlbumList
                    items={data.albums}
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
            <>
                <ArtistPortraitAddedComponent variables={{ artistId }} onData={this.handlePortraitAdded} />
                <AlbumAddedComponent onData={this.handleAlbumAdded} />
                <AlbumRemovedComponent onData={this.handleAlbumRemoved} />
                <AlbumsUpdatedComponent onData={this.handleAlbumsUpdated} />
                <ArtistAlbumsComponent onCompleted={this.handleQueryCompleted} variables={{ artistId }}>
                    {this.renderBody}
                </ArtistAlbumsComponent>
            </>
        );
    }
}
