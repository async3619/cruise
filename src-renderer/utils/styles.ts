import { ButtonProps, darken, lighten, Theme } from "@mui/material";

interface DarkenGetColorOptions {
    darken: number;
}

interface LightenGetColorOptions {
    lighten: number;
}

type GetColorOptions = DarkenGetColorOptions | LightenGetColorOptions;

export function getTextColor(theme: Theme, color: ButtonProps["color"]) {
    return theme.palette.getContrastText(getBackColor(theme, color));
}

export function getBackColor(
    theme: Theme,
    color: ButtonProps["color"],
    inheritOptions?: GetColorOptions,
    coloredOptions?: GetColorOptions,
) {
    let colorValue: string;
    color = color || "inherit";

    if (color === "inherit") {
        colorValue = theme.palette.background.default;
    } else {
        colorValue = theme.palette[color].main;
    }

    const targetOptions = color === "inherit" ? inheritOptions : coloredOptions;
    if (targetOptions) {
        if ("darken" in targetOptions) {
            return darken(colorValue, targetOptions.darken);
        } else if ("lighten" in targetOptions) {
            return lighten(colorValue, targetOptions.lighten);
        }
    }

    return colorValue;
}
