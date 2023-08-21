import React from "react";
import { createHashRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";

import { Layout } from "@components/Layout";

import { Home } from "@pages/Home";

const router = createHashRouter(
    createRoutesFromElements(
        <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
        </Route>,
    ),
);

export function Routes() {
    return <RouterProvider router={router} />;
}
