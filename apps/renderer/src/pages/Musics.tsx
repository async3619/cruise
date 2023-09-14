import React from "react";
import { useTranslation } from "react-i18next";

import { Button } from "ui";

import { useMusicsQuery } from "@graphql/queries";
import ShuffleRoundedIcon from "@mui/icons-material/ShuffleRounded";

import { Page } from "@components/Page";
import { MusicList } from "@components/MusicList";
import { MusicSelection } from "@components/Selection/Music";
import { MusicSelectionToolbar } from "@components/Selection/MusicToolbar";
import { usePlayer } from "@components/Player/context";

export interface MusicsProps {}

export function Musics({}: MusicsProps) {
    const { t } = useTranslation();
    const { data, loading } = useMusicsQuery();
    const player = usePlayer();

    const handleShuffleAll = React.useCallback(() => {
        if (!data) {
            return;
        }

        player.playPlaylist(data.musics, 0, true);
    }, [data, player]);

    if (!data || loading) {
        return <Page header={t("pages.musics")} loading />;
    }

    return (
        <MusicSelection items={data.musics}>
            <Page
                header={t("pages.musics")}
                toolbar={
                    <MusicSelectionToolbar>
                        <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            startIcon={<ShuffleRoundedIcon />}
                            onClick={handleShuffleAll}
                        >
                            {t("common.shuffle-all")}
                        </Button>
                    </MusicSelectionToolbar>
                }
            >
                <MusicList musics={data.musics} />
            </Page>
        </MusicSelection>
    );
}
