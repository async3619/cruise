import React from "react";
import { nanoid } from "nanoid";

import { DialogContext } from "./context";
import { DialogContextValues, DialogItem, DialogResult, BaseDialogProps } from "./types";

export interface DialogProviderProps {
    children: React.ReactNode;
}

export function DialogProvider({ children }: DialogProviderProps) {
    const [dialogQueue, setDialogQueue] = React.useState<DialogItem[]>([]);

    const openDialog = React.useCallback<DialogContextValues["openDialog"]>((component, options) => {
        return new Promise<DialogResult<any>>(resolve => {
            setDialogQueue(prev => {
                const newDialog: DialogItem = {
                    component: component as any,
                    options,
                    resolve,
                    key: nanoid(),
                    closing: false,
                };

                return [...prev, newDialog];
            });
        });
    }, []);

    const handleDialogClose = React.useCallback<BaseDialogProps<unknown>["onClose"]>(
        result => {
            dialogQueue[0].resolve(result);

            setDialogQueue(([dialog, ...newDialogItems]) => {
                return [
                    {
                        ...dialog,
                        closing: true,
                    },
                    ...newDialogItems,
                ];
            });
        },
        [dialogQueue],
    );
    const handleDialogClosed = React.useCallback(() => {
        setDialogQueue(([, ...newDialogItems]) => newDialogItems);
    }, []);

    const contextValue = React.useMemo<DialogContextValues>(() => {
        return { openDialog };
    }, [openDialog]);

    let dialogContent: React.ReactNode = null;
    if (dialogQueue.length > 0) {
        const { component: DialogComponent, key, options, closing } = dialogQueue[0];

        dialogContent = (
            <DialogComponent
                key={key}
                {...options}
                open={!closing}
                onClose={handleDialogClose}
                onClosed={handleDialogClosed}
            />
        );
    }

    return (
        <DialogContext.Provider value={contextValue}>
            {children}
            {dialogContent}
        </DialogContext.Provider>
    );
}
