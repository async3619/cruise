import React from "react";

import { Typography } from "@mui/material";

import { DialogButtonType, DialogPropBase } from "@dialogs";
import BaseDialog, { DialogButton } from "@dialogs/Base";

import { Root } from "@dialogs/Alert/index.styles";

export interface AlertDialogProps extends DialogPropBase<void> {
    content: string;
}
export interface AlertDialogStates {}

export default class AlertDialog extends React.Component<AlertDialogProps, AlertDialogStates> {
    private readonly buttons: DialogButton[] = [
        {
            label: "Confirm",
            type: DialogButtonType.Ok,
            props: {
                color: "primary",
            },
        },
    ];

    public render() {
        const { content } = this.props;

        return (
            <BaseDialog {...this.props} maxWidth="xs" buttons={this.buttons}>
                <Root>
                    <Typography variant="body1">{content}</Typography>
                </Root>
            </BaseDialog>
        );
    }
}
