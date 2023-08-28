import React from "react";
import { createHashRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";

import { Layout } from "@components/Layout";

import { Home } from "@pages/Home";
import { Settings } from "@pages/Settings";
import { Musics } from "@pages/Musics";
import { NowPlaying } from "@pages/NowPlaying";

const router = createHashRouter(
    createRoutesFromElements(
        <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/library/musics" element={<Musics />} />
            <Route path="/playlists/now-playing" element={<NowPlaying />} />
        </Route>,
    ),
);

export function Routes() {
    return <RouterProvider router={router} />;
}
