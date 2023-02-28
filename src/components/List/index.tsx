import React from "react";

import ListItem from "@components/List/Item";

import { ListItemType } from "@components/List/index.types";
import { Gap, Root, Separator } from "@components/List/index.styles";

export interface ListProps {
    items: ListItemType[];
    onClick?: (item: ListItemType) => void;
}

export default class List extends React.Component<ListProps> {
    private renderGap = (index: number) => {
        return <Gap key={+index} />;
    };
    private renderSeparator = (index: number) => {
        return <Separator key={+index} />;
    };

    public renderItem = (item: ListItemType, index: number) => {
        if (item === "gap") {
            return this.renderGap(index);
        }

        if (item === "separator") {
            return this.renderSeparator(index);
        }

        return <ListItem item={item} key={item.id} />;
    };

    public render() {
        const { items } = this.props;

        return <Root>{items.map(this.renderItem)}</Root>;
    }
}
