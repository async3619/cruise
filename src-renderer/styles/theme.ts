import { experimental_extendTheme as extendTheme } from "@mui/material/styles";

export const backgroundColors = {
    "50": "#f6f6f7",
    "100": "#e2e3e5",
    "200": "#c4c7cb",
    "300": "#9fa2a9",
    "400": "#7a7f87",
    "500": "#60646c",
    "600": "#4b4e56",
    "700": "#3f4146",
    "800": "#35363a",
    "900": "#2e3033",
    "950": "#1e1f22",
};

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
        fontFamily: "SUIT Variable, sans-serif",
        fontWeightRegular: 600,
    },
    components: {
        MuiChip: {
            styleOverrides: {
                root: {
                    fontSize: "0.85rem",
                },
            },
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    fontSize: "0.75rem",
                },
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
