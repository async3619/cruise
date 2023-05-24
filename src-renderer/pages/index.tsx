import React from "react";
import { Route } from "react-router-dom";

import { Layout } from "@components/Layout";

import { Home } from "@pages/Home";
import { Search } from "@pages/Search";
import { Library } from "@pages/Library";
import { Settings } from "@pages/Settings";
import { Musics } from "@pages/Musics";
import { Artists } from "@pages/Artists";
import { Albums } from "@pages/Albums";
import { Album } from "@pages/Album";
import { Artist } from "@pages/Artist";

export const Router = (
    <Route path="/" element={<Layout />}>
        <Route path="" element={<Home />} />
        <Route path="search" element={<Search />} />
        <Route path="library" element={<Library />} />
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
    </Route>
);
