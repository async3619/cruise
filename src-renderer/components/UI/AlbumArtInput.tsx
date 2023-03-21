import { z } from "zod";
import React from "react";

import { Box, Grid, Typography } from "@mui/material";

import AlbumArt from "@components/UI/AlbumArt";
import Button from "@components/UI/Button";
import TextField from "@components/UI/TextField";
import ComboBox, { ComboBoxItem } from "@components/UI/ComboBox";

import { AlbumArtWrapper, Description, Pagination, Root } from "@components/UI/AlbumArtInput.styles";

import { AlbumArtType, SelectAlbumArtFileDocument, SelectAlbumArtFileMutation } from "@queries";
import withClient, { WithClientProps } from "@graphql/withClient";
import withDialog, { WithDialogProps } from "@dialogs/withDialog";

import formatFileSize from "@utils/formatFileSize";

export const ALBUM_ART_ITEM_SCHEMA = z.object({
    id: z.number(),
    type: z.nativeEnum(AlbumArtType),
    mimeType: z.string(),
    description: z.string().optional(),
    width: z.number(),
    height: z.number(),
    size: z.number(),
    path: z.string(),
    created: z.boolean().optional(),
});

export type AlbumArtItem = z.infer<typeof ALBUM_ART_ITEM_SCHEMA>;

export interface AlbumArtInputProps extends WithClientProps, WithDialogProps {
    value: AlbumArtItem[];
    onChange(value: AlbumArtItem[]): void;
}
export interface AlbumArtInputStates {
    index: number;
}

const ALBUM_ART_TYPES: ComboBoxItem<AlbumArtType>[] = [
    { label: "Artist", value: AlbumArtType.Artist },
    { label: "Band", value: AlbumArtType.Band },
    { label: "Band Logo", value: AlbumArtType.BandLogo },
    { label: "BrightFish", value: AlbumArtType.BrightFish },
    { label: "Composer", value: AlbumArtType.Composer },
    { label: "Conductor", value: AlbumArtType.Conductor },
    { label: "Back Cover", value: AlbumArtType.CoverBack },
    { label: "Front Cover", value: AlbumArtType.CoverFront },
    { label: "During Performance", value: AlbumArtType.DuringPerformance },
    { label: "During Recording", value: AlbumArtType.DuringRecording },
    { label: "Icon", value: AlbumArtType.Icon },
    { label: "Illustration", value: AlbumArtType.Illustration },
    { label: "Lead Artist", value: AlbumArtType.LeadArtist },
    { label: "Leaflet", value: AlbumArtType.Leaflet },
    { label: "Lyricist", value: AlbumArtType.Lyricist },
    { label: "Media", value: AlbumArtType.Media },
    { label: "Other", value: AlbumArtType.Other },
    { label: "Other Icon", value: AlbumArtType.OtherIcon },
    { label: "Publisher Logo", value: AlbumArtType.PublisherLogo },
    { label: "Recording Location", value: AlbumArtType.RecordingLocation },
    { label: "Screen Capture", value: AlbumArtType.ScreenCapture },
];

class AlbumArtInput extends React.Component<AlbumArtInputProps, AlbumArtInputStates> {
    public state: AlbumArtInputStates = {
        index: 0,
    };

    private handleTypeChange = (type: AlbumArtType) => {
        const { value, onChange } = this.props;
        const { index: currentIndex } = this.state;

        onChange(
            value.map((item, index) => {
                if (index === currentIndex) {
                    return {
                        ...item,
                        type,
                    };
                }

                return item;
            }),
        );
    };
    private handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, onChange } = this.props;
        const { index: currentIndex } = this.state;
        const description = event.target.value;

        onChange(
            value.map((item, index) => {
                if (index === currentIndex) {
                    return {
                        ...item,
                        description,
                    };
                }

                return item;
            }),
        );
    };
    private handleDelete = () => {
        const { value, onChange } = this.props;
        const { index: currentIndex } = this.state;

        this.setState({
            index: Math.max(0, currentIndex - 1),
        });

        onChange(value.filter((_, index) => index !== currentIndex));
    };
    private handleAdd = async () => {
        this.props.showBackdrop();

        const { data } = await this.props.client.mutate<SelectAlbumArtFileMutation>({
            mutation: SelectAlbumArtFileDocument,
        });

        this.props.hideBackdrop();

        if (!data?.selectAlbumArtFile) {
            return;
        }

        this.props.onChange([
            ...this.props.value,
            {
                ...data.selectAlbumArtFile,
                created: true,
            },
        ]);
    };
    private handlePrevClick = () => {
        const { index } = this.state;
        if (index === 0) {
            return;
        }

        this.setState({
            index: index - 1,
        });
    };
    private handleNextClick = () => {
        const { value } = this.props;
        const { index } = this.state;
        if (index === value.length - 1) {
            return;
        }

        this.setState({
            index: index + 1,
        });
    };

    private renderEmpty() {
        return (
            <Root>
                <AlbumArtWrapper>
                    <AlbumArt size="100%" />
                    <Box mt={1}>
                        <Grid container spacing={1}>
                            <Grid item xs={6}>
                                <Button fullWidth onClick={this.handleAdd}>
                                    Add
                                </Button>
                            </Grid>
                            <Grid item xs={6}>
                                <Button disabled fullWidth onClick={this.handleDelete}>
                                    Delete
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </AlbumArtWrapper>
                <Description>
                    <Box
                        flex="1 1 auto"
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        fontStyle="italic"
                        color="text.secondary"
                    >
                        <Typography variant="body1">No album art available.</Typography>
                    </Box>
                    <Pagination>
                        <Button disabled>Prev</Button>
                        <Typography variant="body1" sx={{ flex: "1 1 auto" }} align="center">
                            0 / 0
                        </Typography>
                        <Button disabled>Next</Button>
                    </Pagination>
                </Description>
            </Root>
        );
    }
    public render() {
        const { value } = this.props;
        const { index } = this.state;
        if (value.length === 0) {
            return this.renderEmpty();
        }

        const currentIndex = index + 1;
        const currentAlbumArt = value[index];
        const url = `cruise://${currentAlbumArt.path}`;

        return (
            <Root>
                <AlbumArtWrapper>
                    <AlbumArt size="100%" image={url} />
                    <Box mt={1}>
                        <Grid container spacing={1}>
                            <Grid item xs={6}>
                                <Button fullWidth onClick={this.handleAdd}>
                                    Add
                                </Button>
                            </Grid>
                            <Grid item xs={6}>
                                <Button fullWidth onClick={this.handleDelete}>
                                    Delete
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </AlbumArtWrapper>
                <Description>
                    <Box>
                        <Typography gutterBottom variant="body1" fontWeight={800}>
                            Type
                        </Typography>
                        <ComboBox
                            variant="outlined"
                            items={ALBUM_ART_TYPES}
                            value={currentAlbumArt.type}
                            onChange={this.handleTypeChange}
                        />
                    </Box>
                    <Box>
                        <Typography gutterBottom variant="body1" fontWeight={800}>
                            Description
                        </Typography>
                        <TextField
                            type="text"
                            value={currentAlbumArt.description}
                            onChange={this.handleDescriptionChange}
                        />
                    </Box>
                    <Box>
                        <Grid container spacing={2}>
                            <Grid item xs={3}>
                                <Typography gutterBottom variant="body1" fontWeight={800}>
                                    Mime
                                </Typography>
                                <Typography variant="body1">{currentAlbumArt.mimeType}</Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <Typography gutterBottom variant="body1" fontWeight={800}>
                                    Width
                                </Typography>
                                <Typography variant="body1">{currentAlbumArt.width}px</Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <Typography gutterBottom variant="body1" fontWeight={800}>
                                    Height
                                </Typography>
                                <Typography variant="body1">{currentAlbumArt.height}px</Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <Typography gutterBottom variant="body1" fontWeight={800}>
                                    Size
                                </Typography>
                                <Typography variant="body1">{formatFileSize(currentAlbumArt.size)}</Typography>
                            </Grid>
                        </Grid>
                    </Box>
                    <Pagination>
                        <Button disabled={currentIndex === 1} onClick={this.handlePrevClick}>
                            Prev
                        </Button>
                        <Typography variant="body1" sx={{ flex: "1 1 auto" }} align="center">
                            {currentIndex} / {value.length}
                        </Typography>
                        <Button disabled={currentIndex >= value.length} onClick={this.handleNextClick}>
                            Next
                        </Button>
                    </Pagination>
                </Description>
            </Root>
        );
    }
}

export default withDialog(withClient(AlbumArtInput));
