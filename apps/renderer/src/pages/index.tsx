import React from "react";
import { createHashRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";

import { Layout } from "@components/Layout";

import { Home } from "@pages/Home";
import { Settings } from "@pages/Settings";
import { Musics } from "@pages/Musics";
import { NowPlaying } from "@pages/NowPlaying";
import { Playlist } from "@pages/Playlist";
import { Albums } from "@pages/Albums";

const router = createHashRouter(
    createRoutesFromElements(
        <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/library/musics" element={<Musics />} />
            <Route path="/library/albums" element={<Albums />} />
            <Route path="/playlists/now-playing" element={<NowPlaying />} />
            <Route path="/playlists/:id" element={<Playlist />} />
        </Route>,
    ),
);

export function Routes() {
    return <RouterProvider router={router} />;
}
