import { experimental_extendTheme as extendTheme } from "@mui/material/styles";

export const theme = extendTheme({
    colorSchemes: {
        light: {},
        dark: {
            palette: {
                background: {
                    default: "#313338",
                },
            },
        },
    },
    typography: {
        fontFamily: "SUIT Variable, sans-serif",
        fontWeightRegular: 600,
    },
    components: {
        MuiButton: {
            defaultProps: {
                disableElevation: true,
            },
        },
    },
});
