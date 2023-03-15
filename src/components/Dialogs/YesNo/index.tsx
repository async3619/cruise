import React from "react";

import { DialogButtonType, DialogPropBase } from "@dialogs";
import BaseDialog, { DialogButton } from "@dialogs/Base";

import { Root } from "@dialogs/YesNo/index.styles";
import { Typography } from "@mui/material";

export interface YesNoDialogProps extends DialogPropBase<void> {
    content: string;
    positiveLabel?: string;
    positiveProps?: DialogButton["props"];
    negativeLabel?: string;
    negativeProps?: DialogButton["props"];
}
export interface YesNoDialogStates {}

export default class YesNoDialog extends React.Component<YesNoDialogProps, YesNoDialogStates> {
    private readonly buttons: DialogButton[] = [
        {
            label: this.props.negativeLabel || "Cancel",
            type: DialogButtonType.Cancel,
            props: {
                ...this.props.negativeProps,
            },
        },
        {
            label: this.props.positiveLabel || "Confirm",
            type: DialogButtonType.Ok,
            props: {
                color: "primary",
                ...this.props.positiveProps,
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
