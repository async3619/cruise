import { createTheme } from "@mui/material";

export const mainTheme = createTheme({
    palette: {
        text: {
            primary: "rgba(0, 0, 0, 0.8956)",
            secondary: "rgba(0, 0, 0, 0.6063)",
            disabled: "rgba(0, 0, 0, 0.3614)",
        },
    },
    typography: {
        fontFamily: ["SUIT Variable", "sans-serif"].join(","),
        fontWeightRegular: 600,
    },
    components: {
        MuiButtonBase: {
            defaultProps: {
                disableRipple: true,
            },
        },
    },
});
