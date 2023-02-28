import React from "react";

import { Typography } from "@mui/material";

import { NormalListItem } from "@components/List/index.types";
import { Button, Root } from "@components/List/Item.styles";

export interface ListItemProps {
    item: NormalListItem;
}
export interface ListItemStates {}

export default class ListItem extends React.Component<ListItemProps, ListItemStates> {
    public render() {
        const { item } = this.props;
        const { icon: Icon } = item;

        return (
            <Root>
                <Button>
                    <Icon />
                    <Typography variant="body1" fontSize="0.9rem" lineHeight={1}>
                        {item.label}
                    </Typography>
                </Button>
            </Root>
        );
    }
}
