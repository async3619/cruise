import React from "react";
import { DialogContextValues } from "./types";

export const DialogContext = React.createContext<DialogContextValues | null>(null);

export function useDialog() {
    const context = React.useContext(DialogContext);
    if (!context) {
        throw new Error("useDialog must be used within a <DialogProvider />");
    }

    return context;
}
