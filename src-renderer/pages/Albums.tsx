import React from "react";
import { useTranslation } from "react-i18next";

import { Box } from "@mui/material";

import { Page } from "@components/Page";
import { Card } from "@components/Card";
import { useLibrary } from "@components/Library/Provider";
import { usePlayer } from "@components/Player/Provider";
import { LibraryPage } from "@components/Page/Library";
import { useAlbumSelection } from "@components/MediaSelection/Provider";

import { MinimalAlbumFragment } from "@queries";

export interface AlbumsProps {}

export function Albums({}: AlbumsProps) {
    const { t } = useTranslation();
    const library = useLibrary();
    const player = usePlayer();
    const { albums, loading } = library.useAlbums();
    const albumSelection = useAlbumSelection();

    React.useEffect(() => {
        if (!albums) {
            return;
        }

        albumSelection.setItems(albums);
    }, [albums, albumSelection]);

    if (loading || !albums) {
        return <Page loading title={t("pageTitle.albums")} />;
    }

    const handleAlbumPlay = (album: MinimalAlbumFragment) => {
        player.playPlaylist(album.musics, 0);
    };
    const handleShuffleAll = () => {
        const allMusics = albums.flatMap(a => a.musics);

        player.playPlaylist(allMusics, 0, true);
    };

    const handleAlbumSelect = (index: number, album: MinimalAlbumFragment, selected?: boolean) => {
        if (selected) {
            albumSelection.selectItem(index);
        } else {
            albumSelection.unselectItem(index);
        }
    };

    return (
        <LibraryPage toolbarType="album" title={t("pageTitle.albums")} onShuffleAll={handleShuffleAll}>
            <Box display="flex" flexWrap="wrap">
                {albums.map((album, index) => (
                    <Card
                        key={album.id}
                        item={album}
                        onPlay={handleAlbumPlay}
                        href={`/albums/${album.id}`}
                        selected={albumSelection.selectedIndices.includes(index)}
                        selectMode={albumSelection.selectedIndices.length > 0}
                        onSelectionChange={handleAlbumSelect.bind(null, index)}
                    />
                ))}
            </Box>
        </LibraryPage>
    );
}
