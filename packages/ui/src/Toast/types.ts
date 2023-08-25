import React from "react";
import { AlertColor } from "@mui/material";

export interface ToastLinkAction {
    label: string;
    to: string;
}
export interface ToastEventAction {
    label: string;
    onClick: () => void;
}

export type ToastAction = ToastLinkAction | ToastEventAction;
export type ToastSeverity = AlertColor;

export interface ToastItem {
    id: string;
    severity?: ToastSeverity;
    message: string;
    icon?: React.ReactNode;
    loading?: boolean;
    persist?: boolean;
    action?: ToastAction;
    close(): void;
}

export type ToastOptions = Omit<ToastItem, "id" | "close">;

export interface WorkOptions<T> extends Omit<ToastOptions, "message" | "action"> {
    messages: {
        success: string;
        error: string;
        pending: string;
    };
    work(): Promise<T>;
    action?: ToastAction | ((result: T) => ToastAction | undefined);
}

export interface ToastInstance {
    update(options: Partial<ToastOptions>): void;
}

export interface ToastContextValues {
    queue: ToastItem[];
    enqueueToast(options: ToastOptions): ToastInstance;
    doWork<T>(options: WorkOptions<T>): Promise<T>;
}
