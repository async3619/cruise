import React from "react";
import { Outlet, Route, Routes, useLocation } from "react-router-dom";
import { CSSTransition } from "react-transition-group";

import Layout from "@components/Layout";
import { Root } from "@components/Router.styles";

import Home from "@pages/Home";
import Music from "@pages/Music";
import Settings from "@pages/Settings";

export default function Router() {
    const location = useLocation();

    return (
        <Routes>
            <Route
                element={
                    <Layout>
                        <Root>
                            <CSSTransition key={location.pathname} classNames="right" timeout={100}>
                                <Outlet />
                            </CSSTransition>
                        </Root>
                    </Layout>
                }
            >
                <Route path="/" element={<Home />} />
                <Route path="/music" element={<Music />} />
                <Route path="/settings" element={<Settings />} />
            </Route>
        </Routes>
    );
}
