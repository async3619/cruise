import { createMemoryRouter } from "react-router-dom";

import Home from "@pages/Home";

export const router = createMemoryRouter([{ path: "/", element: <Home /> }]);
