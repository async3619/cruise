import { z } from "zod";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Box, Grid } from "@mui/material";

import TextField from "@components/UI/TextField";
import AlbumArt from "@components/UI/AlbumArt";
import Autocomplete from "@components/UI/Autocomplete";
import AutoHeight from "@components/AutoHeight";

import { DialogPropBase } from "@dialogs";
import FormDialog from "@dialogs/Form";

import { useApolloClient } from "@apollo/client";
import { ArtistNamesDocument, ArtistNamesQuery } from "@queries";

import { AlbumType, ArtistNamesItem } from "@utils/types";

const ALBUM_UPDATE_VALUE_SCHEMA = z.object({
    title: z.string().nonempty({ message: "Title should not be empty" }),
    genre: z.string().optional(),
    year: z.coerce
        .string()
        .regex(/^(\d+)?$/, { message: "Year should be a number" })
        .optional(),
    albumArtists: z.array(z.union([z.string(), z.object({ id: z.number(), name: z.string() })])),
});

export type AlbumUpdateValues = z.infer<typeof ALBUM_UPDATE_VALUE_SCHEMA>;
export interface AlbumUpdateDialogProps extends DialogPropBase<AlbumUpdateValues> {
    album: AlbumType;
}

export default function AlbumUpdateDialog(props: AlbumUpdateDialogProps) {
    const { album } = props;

    const albumArtistDefaultValue: ArtistNamesItem[] = React.useMemo(() => {
        return album.leadArtists.map(artist => ({ id: artist.id, name: artist.name }));
    }, [album.leadArtists]);
    const form = useForm<AlbumUpdateValues>({
        mode: "all",
        resolver: zodResolver(ALBUM_UPDATE_VALUE_SCHEMA),
        defaultValues: {
            title: album.title,
            albumArtists: albumArtistDefaultValue,
            genre: album.genre || "",
            year: `${album.year || ""}`,
        },
    });

    const client = useApolloClient();
    const fetchOptions = async () => {
        const { data } = await client.query<ArtistNamesQuery>({
            query: ArtistNamesDocument,
        });

        return data.artists;
    };

    const {
        register,
        formState: { errors },
        control,
    } = form;

    return (
        <FormDialog {...props} form={form} formId="album-update-form">
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Box display="flex" alignItems="stretch">
                        <Box flex="1 1 auto" mr={2}>
                            <Box mb={2}>
                                <TextField
                                    type="text"
                                    fullWidth
                                    label="Title"
                                    {...register("title")}
                                    error={!!errors.title}
                                />
                            </Box>
                            <Box mb={2}>
                                <TextField
                                    type="text"
                                    fullWidth
                                    label="Genre"
                                    {...register("genre")}
                                    error={!!errors.genre}
                                />
                            </Box>
                            <Box>
                                <TextField
                                    type="text"
                                    fullWidth
                                    label="Year"
                                    {...register("year")}
                                    error={!!errors.year}
                                />
                            </Box>
                        </Box>
                        <Box>
                            <AutoHeight>{height => <AlbumArt size={height} />}</AutoHeight>
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <Controller
                        control={control}
                        name={"albumArtists"}
                        defaultValue={albumArtistDefaultValue}
                        render={({ field: { onChange, ref, ...field }, fieldState }) => (
                            <Autocomplete
                                multiple
                                inputRef={ref}
                                options={fetchOptions}
                                labelField="name"
                                idField="id"
                                label="Album Artist"
                                error={!!fieldState.error}
                                onSelect={(_, value) => onChange(value)}
                                {...field}
                            />
                        )}
                    />
                </Grid>
            </Grid>
        </FormDialog>
    );
}
