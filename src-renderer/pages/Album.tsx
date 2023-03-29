import * as _ from "lodash";
import React from "react";

import { Typography } from "@mui/material";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import ShuffleRoundedIcon from "@mui/icons-material/ShuffleRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";

import ShrinkHeaderPage from "@components/Page/ShrinkHeader";
import Button from "@components/UI/Button";
import MusicList from "@components/UI/MusicList";
import DotList from "@components/UI/DotList";

import AlbumUpdateDialog from "@components/Dialogs/AlbumUpdate";

import {
    AlbumArtType,
    AlbumComponent,
    AlbumQuery,
    AlbumQueryResult,
    AlbumRemovedComponent,
    AlbumRemovedSubscription,
    AlbumUpdatedComponent,
    AlbumUpdatedSubscription,
    MusicsUpdatedComponent,
    MusicsUpdatedSubscription,
    UpdateAlbumDocument,
    UpdateAlbumMutation,
    UpdateAlbumMutationVariables,
} from "@queries";

import formatDuration from "@utils/formatDuration";
import { AlbumType, BasePageProps, PlayableMusic } from "@utils/types";
import { OnDataOptions } from "@apollo/client";

export interface AlbumProps extends BasePageProps {}
export interface AlbumStates {
    musics: PlayableMusic[] | null;
    metadata: string[];
    albumId: number | null;
    album: AlbumType | null;
}

export default class Album extends React.Component<AlbumProps, AlbumStates> {
    private refetch: AlbumQueryResult["refetch"] | null = null;
    public state: AlbumStates = {
        musics: null,
        metadata: [],
        albumId: null,
        album: null,
    };

    public componentDidMount() {
        const { params } = this.props;
        if (!params.albumId) {
            throw new Error("Album ID is required");
        }

        const id = Number(params.albumId);
        if (isNaN(id)) {
            throw new Error("Album ID must be a number");
        }

        this.setState({ albumId: id });
    }

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

        this.setState({ musics: query.album.musics, metadata, album: query.album });
    };
    private handleAlbumUpdated = ({ data: { data } }: OnDataOptions<AlbumUpdatedSubscription>) => {
        if (!data || data.albumUpdated.id !== this.state.albumId) {
            return;
        }

        if (!this.refetch) {
            throw new Error("Refetch not found");
        }

        this.refetch();
    };
    private handleMusicsUpdated = ({ data: { data } }: OnDataOptions<MusicsUpdatedSubscription>) => {
        if (!data || !this.refetch) {
            return;
        }

        const { musics } = this.state;
        if (!musics) {
            return;
        }

        const updatedMusics = data.musicsUpdated;
        const isUpdated = updatedMusics.some(music => {
            return musics.some(m => m.id === music.id);
        });
        if (!isUpdated) {
            return;
        }

        this.refetch();
    };
    private handleAlbumRemoved = ({ data: { data } }: OnDataOptions<AlbumRemovedSubscription>) => {
        if (!data || data.albumRemoved !== this.state.albumId) {
            return;
        }

        this.props.navigate("/", {
            replace: true,
        });
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
    private handleEditClick = async () => {
        if (!this.refetch) {
            throw new Error("Refetch not found");
        }

        if (!this.state.album) {
            throw new Error("Album data not found");
        }

        const result = await this.props.dialog.showDialog(AlbumUpdateDialog, "Edit Album Information", {
            album: this.state.album,
        });

        if (result.reason !== "submit") {
            return;
        }

        await this.props.client.mutate<UpdateAlbumMutation, UpdateAlbumMutationVariables>({
            mutation: UpdateAlbumDocument,
            variables: {
                id: this.state.album.id,
                data: {
                    title: result.data.title,
                    albumArtists: result.data.albumArtists.map(artist => {
                        if (typeof artist === "string") {
                            return artist;
                        }

                        return artist.name;
                    }),
                    year: result.data.year,
                    genre: result.data.genre,
                    albumArts: result.data.albumArts.map(art => {
                        return {
                            type: art.type,
                            path: art.path,
                            description: art.description,
                        };
                    }),
                },
            },
        });
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
                <Button icon={EditRoundedIcon} onClick={this.handleEditClick}>
                    Edit Information
                </Button>
            </>
        );
    };
    private renderBody = ({ data, loading, refetch }: AlbumQueryResult) => {
        this.refetch = refetch;

        if (loading) {
            return <ShrinkHeaderPage loading />;
        }

        if (!data?.album) {
            throw new Error("Album not found");
        }

        const { player } = this.props;
        const album = data.album;
        const albumArt = album.albumArts.find(art => art.type === AlbumArtType.CoverFront) || album.albumArts[0];
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
        const { albumId } = this.state;
        if (!albumId) {
            return <ShrinkHeaderPage loading />;
        }

        return (
            <>
                <MusicsUpdatedComponent onData={this.handleMusicsUpdated} />
                <AlbumRemovedComponent onData={this.handleAlbumRemoved} />
                <AlbumUpdatedComponent variables={{ id: albumId }} onData={this.handleAlbumUpdated} />
                <AlbumComponent onCompleted={this.handleQueryCompleted} variables={{ id: albumId }}>
                    {this.renderBody}
                </AlbumComponent>
            </>
        );
    }
}
