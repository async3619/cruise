import { z } from "zod";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Grid } from "@mui/material";

import TextField from "@components/UI/TextField";
import Autocomplete from "@components/UI/Autocomplete";
import AlbumArtInput, { ALBUM_ART_ITEM_SCHEMA } from "@components/UI/AlbumArtInput";

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
    albumArts: z.array(ALBUM_ART_ITEM_SCHEMA),
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

    const albumArtDefaultValue = React.useMemo(() => {
        return album.albumArts;
    }, [album]);

    const form = useForm<AlbumUpdateValues>({
        mode: "all",
        resolver: zodResolver(ALBUM_UPDATE_VALUE_SCHEMA),
        defaultValues: {
            title: album.title,
            albumArtists: albumArtistDefaultValue,
            genre: album.genre || "",
            year: `${album.year || ""}`,
            albumArts: albumArtDefaultValue,
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
                    <Controller
                        control={control}
                        name={"albumArts"}
                        defaultValue={albumArtDefaultValue}
                        render={({ field: { ref: _, ...field } }) => <AlbumArtInput {...field} />}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField type="text" fullWidth label="Title" {...register("title")} error={!!errors.title} />
                </Grid>
                <Grid item xs={12}>
                    <TextField type="text" fullWidth label="Genre" {...register("genre")} error={!!errors.genre} />
                </Grid>
                <Grid item xs={12}>
                    <TextField type="text" fullWidth label="Year" {...register("year")} error={!!errors.year} />
                </Grid>
                <Grid item xs={12}>
                    <Controller
                        control={control}
                        name="albumArtists"
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
