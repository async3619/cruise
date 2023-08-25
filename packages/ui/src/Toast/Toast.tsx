import React from "react";

import { Button, CircularProgress, Typography } from "@mui/material";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";

import { ToastItem } from "./types";
import { Root } from "./Toast.styles";

export interface ToastProps {
    item: ToastItem;
}

export function Toast({ item }: ToastProps) {
    const { severity, message, close, loading, persist, action } = item;
    const isPersisting = persist || loading;
    let icon = item.icon;

    if (loading) {
        icon = <CircularProgress size={16} color="inherit" data-testid="toast-loading" />;
    } else if (typeof icon === "undefined") {
        switch (severity) {
            case "info":
                icon = <InfoRoundedIcon fontSize="small" data-testid="toast-info-icon" />;
                break;

            case "error":
                icon = <ErrorOutlineRoundedIcon fontSize="small" data-testid="toast-error-icon" />;
                break;

            case "warning":
                icon = <WarningAmberRoundedIcon fontSize="small" data-testid="toast-warning-icon" />;
                break;

            case "success":
                icon = <CheckCircleOutlineRoundedIcon fontSize="small" data-testid="toast-success-icon" />;
                break;

            default:
                icon = undefined;
                break;
        }
    }

    React.useEffect(() => {
        if (isPersisting) {
            return;
        }

        const timer = setTimeout(() => {
            close();
        }, 3000);

        return () => {
            clearTimeout(timer);
        };
    }, [close, isPersisting]);

    const handleActionClick = React.useCallback(
        (e: React.MouseEvent) => {
            if (action && "onClick" in action) {
                action.onClick();
            }

            e.stopPropagation();
            close();
        },
        [action, close],
    );

    return (
        <Root
            data-testid="Toast"
            variant="filled"
            icon={false}
            severity={severity}
            onClick={isPersisting ? undefined : close}
            hasButton={!!action}
        >
            {icon}
            <Typography fontSize="0.875rem" sx={{ ml: icon ? 2 : 0, mr: action ? 4 : 0 }} lineHeight={1}>
                {message}
            </Typography>
            {action && (
                <Button
                    sx={{ height: "auto", py: 0 }}
                    onClick={handleActionClick}
                    color={!severity ? "primary" : "inherit"}
                    data-testid="toast-action"
                >
                    {action.label}
                </Button>
            )}
        </Root>
    );
}
