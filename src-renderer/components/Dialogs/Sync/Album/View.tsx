import _ from "lodash";
import React from "react";

import { Box, Grid, Typography } from "@mui/material";

import { AlbumArtWrapper, Description, ListItem, Root, TrackList } from "@dialogs/Sync/Album/View.styles";

import { SearchedAlbum } from "@utils/hooks/useSearchAlbums";
import AlbumArt from "@components/UI/AlbumArt";
import memoizeOne from "memoize-one";
import formatDuration from "@utils/formatDuration";

export interface AlbumSyncViewProps {
    searchedAlbums: SearchedAlbum[];
    onChange(item: SearchedAlbum): void;
    value: SearchedAlbum | null;
    innerRef: React.Ref<HTMLDivElement>;
}
export interface AlbumSyncViewStates {}

export default class AlbumSyncView extends React.Component<AlbumSyncViewProps, AlbumSyncViewStates> {
    private handleItemClick = memoizeOne((item: SearchedAlbum) => () => {
        this.props.onChange(item);
    });

    private renderListItem = (item: SearchedAlbum, index: number) => {
        const { value } = this.props;
        const { locale, album } = item;
        const largestAlbumArt = _.orderBy(album.albumArts, ["width", "height"], ["desc", "desc"])[0];
        const descriptionTokens = [
            album.artists.map(item => item.name).join(", "),
            album.releaseDate,
            `${album.tracks.length} Tracks`,
        ];
        const isActive = value?.album.id === album.id && value?.locale === locale;

        return (
            <ListItem
                active={isActive}
                ref={!index ? this.props.innerRef : undefined}
                tabIndex={-1}
                role="button"
                key={`${album.id}:${locale}`}
                onClick={this.handleItemClick(item)}
            >
                <AlbumArtWrapper>
                    <AlbumArt size="100%" image={largestAlbumArt.url} />
                </AlbumArtWrapper>
                <Description>
                    <Typography variant="body1" fontSize="1.1rem">
                        {album.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {descriptionTokens.join(" · ")}
                    </Typography>
                </Description>
            </ListItem>
        );
    };
    private renderMessage = () => {
        return (
            <Box height="100%" display="flex" justifyContent="center" alignItems="center">
                <Typography variant="body1" color="text.secondary">
                    Select an album to sync
                </Typography>
            </Box>
        );
    };
    private renderTrackList = (item: SearchedAlbum) => {
        const { album } = item;

        return (
            <TrackList>
                <table>
                    <tbody>
                        {album.tracks.map((track, index) => (
                            <tr key={track.id}>
                                <td>
                                    <Typography color="text.secondary" align="right">
                                        {index + 1}.
                                    </Typography>
                                </td>
                                <td>
                                    <Typography>{track.title}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {track.artists.map(item => item.name).join(", ")}
                                        {" · "}
                                        {formatDuration(track.duration / 1000, true)}
                                    </Typography>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </TrackList>
        );
    };
    public render() {
        const { searchedAlbums, value } = this.props;

        return (
            <Root>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        {searchedAlbums.map(this.renderListItem)}
                    </Grid>
                    <Grid item xs={6}>
                        {!value && this.renderMessage()}
                        {value && this.renderTrackList(value)}
                    </Grid>
                </Grid>
            </Root>
        );
    }
}
