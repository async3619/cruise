import React from "react";

import { Typography } from "@mui/material";

import { NormalListItem } from "@components/List/index.types";
import { Button, Root } from "@components/List/Item.styles";

export interface ListItemProps {
    item: NormalListItem;
    onClick?(item: NormalListItem): void;
    active: boolean;
}
export interface ListItemStates {}

export default class ListItem extends React.Component<ListItemProps, ListItemStates> {
    public handleClick = () => {
        const { onClick, item } = this.props;
        if (!onClick) {
            return;
        }

        onClick(item);
    };

    render() {
        const { item, active } = this.props;
        const { icon: Icon } = item;

        return (
            <Root>
                <Button onClick={this.handleClick} active={active}>
                    <Icon />
                    <Typography variant="body1" lineHeight={1}>
                        {item.label}
                    </Typography>
                </Button>
            </Root>
        );
    }
}
