import React from "react";
import { useTranslation } from "react-i18next";

import { LibraryPage } from "@components/Page/Library";
import { MusicList } from "@components/MusicList";
import { useLibrary } from "@components/Library/Provider";
import { usePlayer } from "@components/Player/Provider";

export interface MusicsProps {}

export function Musics({}: MusicsProps) {
    const { t } = useTranslation();
    const library = useLibrary();
    const { musics, loading } = library.useMusics();
    const player = usePlayer();

    const handleShuffleAll = React.useCallback(() => {
        if (!musics || loading || musics.length === 0) {
            return;
        }

        player.playPlaylist(musics, 0, true);
    }, [musics, loading, player]);

    if (loading || !musics) {
        return <LibraryPage toolbarType="music" loading title={t("pageTitle.musics")} />;
    }

    return (
        <LibraryPage toolbarType="music" title={t("pageTitle.musics")} onShuffleAll={handleShuffleAll}>
            <MusicList selectable items={musics} />
        </LibraryPage>
    );
}
