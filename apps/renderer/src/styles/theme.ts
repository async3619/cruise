import { backgroundColors } from "ui";
import { experimental_extendTheme as extendTheme } from "@mui/material/styles";

export const theme = extendTheme({
    colorSchemes: {
        light: {},
        dark: {
            palette: {
                primary: {
                    main: "#389cff",
                },
                background: {
                    default: backgroundColors["800"],
                },
            },
        },
    },
    typography: {
        fontFamily: ["SUIT Variable Webfont", "sans-serif"].join(","),
        fontWeightRegular: 600,
        fontWeightMedium: 600,
    },
    components: {
        MuiSkeleton: {
            defaultProps: {
                animation: "wave",
            },
        },
        MuiButton: {
            defaultProps: {
                disableElevation: true,
            },
            styleOverrides: {
                root: {
                    textTransform: "none",
                },
            },
        },
    },
});
