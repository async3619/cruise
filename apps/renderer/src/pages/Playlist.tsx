import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

import { DialogActionType, useDialog, useToast, YesNoDialog } from "ui";
import { isNumericString } from "utils";

import { PlaylistPage } from "@components/Page/Playlist";
import { useLibrary } from "@components/Library/context";

export interface PlaylistProps {}

export function Playlist({}: PlaylistProps) {
    const { t } = useTranslation();
    const library = useLibrary();
    const toast = useToast();
    const dialog = useDialog();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    if (!id || !isNumericString(id)) {
        throw new Error("Invalid playlist id");
    }

    const playlist = library.usePlaylist(parseInt(id));
    const handleDelete = React.useCallback(async () => {
        const result = await dialog.openDialog(YesNoDialog, {
            title: t("playlist.delete.title"),
            description: t("playlist.delete.description", {
                name: playlist?.name ?? "",
            }),
            positiveLabel: t("common.delete"),
            negativeLabel: t("common.cancel"),
            positiveColor: "error",
        });

        if (result.type !== DialogActionType.Positive) {
            return;
        }

        await toast.doWork({
            work: () => library.deletePlaylist(parseInt(id)),
            loading: true,
            persist: true,
            messages: {
                pending: t("playlist.delete.pending"),
                success: t("playlist.delete.success"),
                error: t("playlist.delete.error"),
            },
        });

        navigate("/");
    }, [dialog, t, playlist?.name, toast, navigate, library, id]);

    return (
        <PlaylistPage
            playlistId={playlist?.id}
            onDelete={handleDelete}
            musics={playlist?.musics ?? []}
            title={playlist?.name ?? ""}
            loading={!playlist}
        />
    );
}
