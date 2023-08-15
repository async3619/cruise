import React from "react";
import { createHashRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";

import { Home } from "@pages/Home";

const router = createHashRouter(createRoutesFromElements(<Route path="/" element={<Home />} />));

export function Routes() {
    return <RouterProvider router={router} />;
}
