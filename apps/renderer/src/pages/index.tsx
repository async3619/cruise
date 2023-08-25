import React from "react";
import { createHashRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";

import { Layout } from "@components/Layout";

import { Home } from "@pages/Home";
import { Settings } from "@pages/Settings";
import { Musics } from "@pages/Musics";

const router = createHashRouter(
    createRoutesFromElements(
        <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/library/musics" element={<Musics />} />
        </Route>,
    ),
);

export function Routes() {
    return <RouterProvider router={router} />;
}
