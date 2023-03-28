import React from "react";
import { Outlet, Route, Routes, useNavigate, useParams } from "react-router-dom";

import Layout from "@components/Layout";

import Home from "@pages/Home";
import Musics from "@pages/Musics";
import Settings from "@pages/Settings";
import Albums from "@pages/Albums";
import Album from "@pages/Album";
import Artists from "@pages/Artists";
import Artist from "@pages/Artist";

import { useApolloClient } from "@apollo/client";
import usePlayer from "@player/usePlayer";
import useDialog from "@dialogs/useDialog";
import useLibrary from "@library/useLibrary";

import { BasePageProps } from "@utils/types";

interface PageWrapperProps {
    component: React.ComponentType<BasePageProps<any>>;
}

function PageWrapper({ component }: PageWrapperProps) {
    const client = useApolloClient();
    const player = usePlayer();
    const dialog = useDialog();
    const params = useParams();
    const navigate = useNavigate();
    const library = useLibrary();
    const Component = component;

    return (
        <Component
            client={client}
            player={player}
            dialog={dialog}
            params={params}
            navigate={navigate}
            library={library}
        />
    );
}

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
                <Route path="/" element={<PageWrapper component={Home} />} />
                <Route path="/musics" element={<PageWrapper component={Musics} />} />
                <Route path="/albums" element={<PageWrapper component={Albums} />} />
                <Route path="/albums/:albumId" element={<PageWrapper component={Album} />} />
                <Route path="/artists" element={<PageWrapper component={Artists} />} />
                <Route path="/artists/:artistId" element={<PageWrapper component={Artist} />} />
                <Route path="/settings" element={<PageWrapper component={Settings} />} />
            </Route>
        </Routes>
    );
}
