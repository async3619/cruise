import React from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import Measure, { ContentRect, MeasuredComponentProps } from "react-measure";

import memoizeOne from "memoize-one";

import { Dialog, DialogContent, DialogProps, DialogTitle, ModalProps } from "@mui/material";

import Button from "@components/UI/Button";

import { DialogButtonType, DialogPropBase } from "@dialogs";
import { Footer, Root } from "@dialogs/Base/index.styles";

export interface DialogButton {
    label: string;
    type: DialogButtonType;
    props?: Partial<React.ComponentProps<typeof Button>>;
}

export interface BaseDialogProps<TData> extends DialogPropBase<TData> {
    maxWidth?: DialogProps["maxWidth"];
    buttons: DialogButton[];
    children: React.ReactNode;
    onData?(): TData;
}
export interface BaseDialogStates {
    contentHeight: number | null;
}

export default class BaseDialog<TData> extends React.Component<BaseDialogProps<TData>, BaseDialogStates> {
    public state: BaseDialogStates = {
        contentHeight: null,
    };

    private handleClose: ModalProps["onClose"] = (_, reason) => {
        switch (reason) {
            case "backdropClick":
                this.props.onClose({
                    reason: "outside-clicked",
                });
                break;

            case "escapeKeyDown":
                this.props.onClose({
                    reason: "escape-pressed",
                });
                break;
        }
    };
    private handleButtonClick = memoizeOne((buttonType: DialogButtonType) => {
        return () => {
            const { onClose, onData } = this.props;

            if (buttonType === DialogButtonType.Submit) {
                if (!onData) {
                    onClose({
                        reason: "button-clicked",
                        buttonType: DialogButtonType.Submit,
                    });

                    return;
                }

                onClose({
                    reason: "submit",
                    data: onData(),
                });
            } else {
                onClose({
                    reason: "button-clicked",
                    buttonType,
                });
            }
        };
    });
    private handleResize = ({ bounds }: ContentRect) => {
        if (!bounds) {
            return;
        }

        const { height } = bounds;
        this.setState({ contentHeight: height });
    };

    private renderContent = ({ measureRef }: MeasuredComponentProps) => {
        const { children } = this.props;

        return <Root ref={measureRef}>{children}</Root>;
    };
    public render() {
        const { open, title, buttons, onClosed, maxWidth } = this.props;
        const { contentHeight } = this.state;

        return (
            <Dialog
                keepMounted
                fullWidth
                scroll="paper"
                open={open && contentHeight !== null}
                maxWidth={maxWidth || "sm"}
                onClose={this.handleClose}
                TransitionProps={{
                    onExited: onClosed,
                }}
            >
                <DialogTitle>
                    <span>{title}</span>
                </DialogTitle>
                <DialogContent dividers sx={{ p: 0 }} style={{ height: (contentHeight || 0) + 1 }}>
                    <Scrollbars>
                        <Measure bounds onResize={this.handleResize}>
                            {this.renderContent}
                        </Measure>
                    </Scrollbars>
                </DialogContent>
                <Footer>
                    {buttons.map(button => (
                        <Button key={button.label} onClick={this.handleButtonClick(button.type)} {...button.props}>
                            {button.label}
                        </Button>
                    ))}
                </Footer>
            </Dialog>
        );
    }
}
