import React from "react";
import memoizeOne from "memoize-one";

import { Box, Typography } from "@mui/material";

import Button from "@components/UI/Button";
import { Item, Label, Root } from "@components/UI/StringList.styles";

import { DialogButtonType } from "@dialogs";
import withDialog, { WithDialogProps } from "@dialogs/withDialog";
import YesNoDialog from "@dialogs/YesNo";

export interface StringListProps extends WithDialogProps {
    items: string[];
    onChange?(items: string[]): void;
}
export interface StringListStates {}

class StringList extends React.Component<StringListProps, StringListStates> {
    private handleDeleteClick = memoizeOne((item: string) => {
        return async () => {
            const { onChange, items, showDialog } = this.props;
            if (!onChange) {
                return;
            }

            const result = await showDialog(YesNoDialog, "Delete Path", {
                content: `Are you sure to delete this path: "${item}"?`,
                positiveLabel: "Delete",
                positiveProps: {
                    color: "error",
                },
            });

            if (result.reason !== "button-clicked" || result.buttonType !== DialogButtonType.Ok) {
                return;
            }

            onChange(items.filter(i => i !== item));
        };
    });

    private renderItem = (item: string, index: number) => {
        return (
            <Item key={+index}>
                <Typography component={Label}>{item}</Typography>
                <Box flex="1 1 auto" />
                <Button onClick={this.handleDeleteClick(item)}>Delete</Button>
            </Item>
        );
    };
    public render() {
        const { items } = this.props;

        return <Root>{items.map(this.renderItem)}</Root>;
    }
}

export default withDialog(StringList);
