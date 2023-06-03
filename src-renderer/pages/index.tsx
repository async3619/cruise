import React from "react";
import { Route } from "react-router-dom";

import { Layout } from "@components/Layout";

import { Home } from "@pages/Home";
import { Settings } from "@pages/Settings";
import { Musics } from "@pages/Musics";
import { Artists } from "@pages/Artists";
import { Albums } from "@pages/Albums";
import { Album } from "@pages/Album";
import { Artist } from "@pages/Artist";
import { Playlist } from "@pages/Playlist";
import { NowPlaying } from "@pages/NowPlaying";

import { Search } from "@pages/Search";
import { MusicSearch } from "@pages/Search/MusicSearch";
import { ArtistSearch } from "@pages/Search/ArtistSearch";
import { AlbumSearch } from "@pages/Search/AlbumSearch";

export const Router = (
    <Route path="/" element={<Layout />}>
        <Route path="" element={<Home />} />
        <Route path="search">
            <Route path="" element={<Search />} />
            <Route path="musics" element={<MusicSearch />} />
            <Route path="artists" element={<ArtistSearch />} />
            <Route path="albums" element={<AlbumSearch />} />
        </Route>
        <Route path="settings" element={<Settings />} />
        <Route path="musics" element={<Musics />} />
        <Route path="artists">
            <Route path="" element={<Artists />} />
            <Route path=":id" element={<Artist />} />
        </Route>
        <Route path="albums">
            <Route path="" element={<Albums />} />
            <Route path=":id" element={<Album />} />
        </Route>
        <Route path="playlists">
            <Route path="" element={<NowPlaying />} />
            <Route path=":id" element={<Playlist />} />
        </Route>
    </Route>
);
