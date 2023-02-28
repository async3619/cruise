import React from "react";

import ListItem from "@components/List/Item";

import { ListItemType, NormalListItem } from "@components/List/index.types";
import { Gap, Root, Separator } from "@components/List/index.styles";

export interface ListProps {
    items: ListItemType[];
    selectedItem?: ListItemType;
    onClick?: (item: NormalListItem) => void;
}

export default class List extends React.Component<ListProps> {
    private renderGap = (index: number) => {
        return <Gap key={+index} />;
    };
    private renderSeparator = (index: number) => {
        return <Separator key={+index} />;
    };

    public renderItem = (item: ListItemType, index: number) => {
        const { onClick, selectedItem } = this.props;
        if (item === "gap") {
            return this.renderGap(index);
        }

        if (item === "separator") {
            return this.renderSeparator(index);
        }

        return <ListItem item={item} key={item.id} onClick={onClick} active={selectedItem === item} />;
    };

    public render() {
        const { items } = this.props;

        return <Root>{items.map(this.renderItem)}</Root>;
    }
}
