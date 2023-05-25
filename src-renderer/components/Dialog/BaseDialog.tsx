import React from "react";

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, ModalProps } from "@mui/material";

import { ActionItem, BaseDialogProps, DialogActionType } from "@components/Dialog/types";

type BaseProps<TValue> = BaseDialogProps<TValue> &
    Omit<React.ComponentProps<typeof Dialog>, "TransitionProps" | "onClose" | "open" | "onSubmit">;

interface Props<TValue> extends BaseProps<TValue> {
    title: string;
    children: React.ReactNode;
    actions: ActionItem[];
    onSubmit?: (event: React.FormEvent<any>) => void;
}

export function BaseDialog<TValue>({
    open,
    onClosed,
    onClose,
    title,
    children,
    actions,
    onSubmit,
    ...rest
}: Props<TValue>) {
    const Root = onSubmit ? "form" : "div";
    const handleClose: ModalProps["onClose"] = () => {
        onClose({ type: DialogActionType.Negative });
    };

    const callClose = (type: Exclude<DialogActionType, DialogActionType.Submit>) => {
        onClose({ type });
    };

    return (
        <Dialog open={open} onClose={handleClose} TransitionProps={{ onExited: onClosed }} {...rest}>
            <Root onSubmit={onSubmit}>
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>{children}</DialogContent>
                <DialogActions>
                    {actions.map(({ type, ...action }, index) => {
                        const props: React.ComponentProps<typeof Button> = {
                            ...action,
                        };

                        if (type === DialogActionType.Submit) {
                            props.type = "submit";
                        } else {
                            props.onClick = () => callClose(type);
                        }

                        return (
                            <Button key={index} {...props}>
                                {action.label}
                            </Button>
                        );
                    })}
                </DialogActions>
            </Root>
        </Dialog>
    );
}
