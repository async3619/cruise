import * as yup from "yup";

import React from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { Box, CircularProgress, Typography } from "@mui/material";

import { DialogPropBase } from "@dialogs";
import FormDialog from "@dialogs/Form";

import { Root } from "@dialogs/Sync/Album/index.styles";
import AlbumSyncView from "@dialogs/Sync/Album/View";

import { useLocales } from "@utils/hooks/useLocales";
import { SearchedAlbum, useSearchAlbums } from "@utils/hooks/useSearchAlbums";

interface AlbumSyncFormValues {
    selectedAlbum: SearchedAlbum;
}

export interface AlbumSyncDialogProps extends DialogPropBase<AlbumSyncFormValues> {
    leadArtistNames: string[];
    albumName: string;
}

export default function AlbumSyncDialog(props: AlbumSyncDialogProps) {
    const { albumName, leadArtistNames, ...rest } = props;
    const locales = useLocales();
    const form = useForm<AlbumSyncFormValues>({
        mode: "all",
        resolver: yupResolver(
            yup.object().shape({
                selectedAlbum: yup.object().required("Please select an album to sync"),
            }),
        ),
    });

    const searchAlbums = useSearchAlbums(locales, `${leadArtistNames.join(", ")} ${albumName}`);

    return (
        <FormDialog {...rest} form={form} formId="album-update-form">
            {searchAlbums.isLoading && (
                <Root>
                    <Box display="flex" justifyContent="center">
                        <CircularProgress size={36} />
                    </Box>
                </Root>
            )}
            {!searchAlbums.isLoading && searchAlbums.data && (
                <Root>
                    <Typography variant="body1" fontSize="1.1rem" sx={{ mb: 2 }}>
                        These are the albums that we found for you. Please select an album that you want to sync with.
                    </Typography>
                    <Controller
                        control={form.control}
                        render={({ field: { value, onChange, ref, ...rest } }) => (
                            <AlbumSyncView
                                innerRef={ref}
                                value={value}
                                onChange={onChange}
                                searchedAlbums={searchAlbums.data}
                                {...rest}
                            />
                        )}
                        name="selectedAlbum"
                    />
                </Root>
            )}
        </FormDialog>
    );
}
