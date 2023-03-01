import React from "react";
import memoizeOne from "memoize-one";

import { Box, Typography } from "@mui/material";

import Button from "@components/UI/Button";
import { Item, Label, Root } from "@components/UI/StringList.styles";

export interface StringListProps {
    items: string[];
    onChange?(items: string[]): void;
}
export interface StringListStates {}

export default class StringList extends React.Component<StringListProps, StringListStates> {
    private handleClick = memoizeOne((item: string) => {
        return () => {
            const { onChange, items } = this.props;
            if (!onChange) {
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
                <Button onClick={this.handleClick(item)}>Delete</Button>
            </Item>
        );
    };
    public render() {
        const { items } = this.props;

        return <Root>{items.map(this.renderItem)}</Root>;
    }
}
