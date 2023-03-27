import React from "react";
import { IsEmpty, Required } from "@utils/types";

export enum DialogButtonType {
    Ok,
    Cancel,
    Submit,
}

export interface OutsideClickedDialogResult {
    reason: "outside-clicked";
}
export interface ButtonClickedDialogResult {
    reason: "button-clicked";
    buttonType: DialogButtonType;
}
export interface EscapePressedDialogResult {
    reason: "escape-pressed";
}
export interface SubmitDialogResult<TData> {
    reason: "submit";
    data: TData;
}

export type DialogResult<TData> =
    | OutsideClickedDialogResult
    | ButtonClickedDialogResult
    | EscapePressedDialogResult
    | SubmitDialogResult<TData>;

export type SnackbarType = "error" | "warning" | "info" | "success" | "loading";

export interface BaseSnackbarOptions<TType extends SnackbarType> {
    type: TType;
    message: string;
    timeout?: number;
}

export interface ErrorSnackbarOptions extends BaseSnackbarOptions<"error"> {}
export interface WarningSnackbarOptions extends BaseSnackbarOptions<"warning"> {}
export interface InfoSnackbarOptions extends BaseSnackbarOptions<"info"> {}
export interface SuccessSnackbarOptions extends BaseSnackbarOptions<"success"> {}
export interface LoadingSnackbarOptions extends BaseSnackbarOptions<"loading"> {}

export type SnackbarOptions =
    | ErrorSnackbarOptions
    | WarningSnackbarOptions
    | InfoSnackbarOptions
    | SuccessSnackbarOptions
    | LoadingSnackbarOptions;

export interface BaseSnackbarInstance {
    close(): void;
}

export interface NormalSnackbarInstance extends BaseSnackbarInstance {}
export interface LoadingSnackbarInstance extends BaseSnackbarInstance {
    success(message: string): void;
    error(message: string): void;
}

export type SnackbarInstance<TType extends SnackbarType> = TType extends "loading"
    ? LoadingSnackbarInstance
    : NormalSnackbarInstance;

export interface SnackbarItem {
    id: string;
    options: SnackbarOptions;
}

export interface SnackbarGlobalOptions extends Omit<BaseSnackbarOptions<SnackbarType>, "type" | "message"> {
    maxItems?: number;
}

export interface DialogPropBase<TData> {
    open: boolean;
    title: string;
    onClose(result: DialogResult<TData>): void;
    onClosed(): void;
    __data?: TData;
}

export interface DialogContextValue {
    showDialog<TProps extends DialogPropBase<any>>(
        component: React.ComponentType<TProps>,
        title: string,
        ...args: IsEmpty<Omit<TProps, keyof DialogPropBase<any>>, [], [data: Omit<TProps, keyof DialogPropBase<any>>]>
    ): Promise<DialogResult<Required<TProps["__data"]>>>;

    showBackdrop(): void;
    hideBackdrop(): void;

    pushSnackbar<TOptions extends SnackbarOptions>(options: TOptions): Promise<SnackbarInstance<TOptions["type"]>>;
}

export const DialogContext = React.createContext<DialogContextValue>({
    showDialog() {
        throw new Error("DialogContext not initialized");
    },
    showBackdrop() {
        throw new Error("DialogContext not initialized");
    },
    hideBackdrop() {
        throw new Error("DialogContext not initialized");
    },
    pushSnackbar() {
        throw new Error("DialogContext not initialized");
    },
});
