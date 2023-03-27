import React from "react";

import { CircularProgress, PaperProps, Typography, useTheme } from "@mui/material";

import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import TaskAltRoundedIcon from "@mui/icons-material/TaskAltRounded";

import { SnackbarGlobalOptions, SnackbarItem, SnackbarType } from "@dialogs";

import { Icon, ProgressBar, Root } from "@dialogs/Snackbar.styles";

export interface SnackbarProps {
    item: SnackbarItem;
    globalOptions: SnackbarGlobalOptions;
    requestClose(item: SnackbarItem): void;
}

const SNACKBAR_ICON_MAP: Record<Exclude<SnackbarType, "loading">, React.ComponentType> = {
    info: InfoOutlinedIcon,
    error: ErrorOutlineRoundedIcon,
    warning: WarningAmberRoundedIcon,
    success: TaskAltRoundedIcon,
};

export default function Snackbar({ item, globalOptions, requestClose }: SnackbarProps) {
    const { timeout = 3000 } = {
        ...globalOptions,
        ...item,
    };
    const {
        options: { type, message },
    } = item;

    const theme = useTheme();
    const backgroundColor = type === "loading" ? theme.palette.background.paper : theme.palette[type].main;
    const foregroundColor = type === "loading" ? theme.palette.text.primary : theme.palette[type].contrastText;

    let IconComponent: React.ComponentType | null = null;
    let iconNode: React.ReactNode | null = null;
    if (type === "loading") {
        iconNode = <CircularProgress size={22} />;
    } else {
        IconComponent = SNACKBAR_ICON_MAP[type];
    }

    const handleClick = () => {
        requestClose(item);
    };

    const rootProps: PaperProps = {};
    if (type === "loading") {
        rootProps.style = {
            cursor: "default",
        };
    } else {
        rootProps.onClick = handleClick;
    }

    return (
        <Root
            role="alert"
            elevation={4}
            sx={{ backgroundColor: backgroundColor, color: foregroundColor }}
            {...rootProps}
        >
            <Icon>
                {iconNode && iconNode}
                {IconComponent && <IconComponent />}
            </Icon>
            <Typography variant="body1" fontSize="0.9rem">
                <span>{message}</span>
            </Typography>
            {type !== "loading" && (
                <ProgressBar
                    style={{ backgroundColor: foregroundColor, animationDuration: `${timeout}ms` }}
                    onAnimationEnd={handleClick}
                />
            )}
        </Root>
    );
}
