import React from "react";
import { Outlet, Route, Routes } from "react-router-dom";

import Layout from "@components/Layout";

import Home from "@pages/Home";
import Musics from "@pages/Musics";
import Settings from "@pages/Settings";

export default function Router() {
    return (
        <Routes>
            <Route
                element={
                    <Layout>
                        <Outlet />
                    </Layout>
                }
            >
                <Route path="/" element={<Home />} />
                <Route path="/musics" element={<Musics />} />
                <Route path="/settings" element={<Settings />} />
            </Route>
        </Routes>
    );
}