import "@emotion/react";

import { experimental_extendTheme as extendTheme } from "@mui/material/styles";

declare module "@emotion/react" {
    export interface Theme extends ReturnType<typeof extendTheme> {}
}
