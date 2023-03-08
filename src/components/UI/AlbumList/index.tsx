import React from "react";

import AlbumListItem from "@components/UI/AlbumList/Item";

import { AlbumListItem as AlbumListItemType } from "@utils/types";

import { Root } from "@components/UI/AlbumList/index.styles";

export interface AlbumListProps {
    items: AlbumListItemType[];
    onPlay(item: AlbumListItemType): void;
}
export interface AlbumListStates {}

export default class AlbumList extends React.Component<AlbumListProps, AlbumListStates> {
    private renderItem = (item: AlbumListItemType) => {
        const { onPlay } = this.props;

        return <AlbumListItem onPlay={onPlay} key={item.id} item={item} />;
    };

    public render() {
        const { items } = this.props;

        return <Root>{items.map(this.renderItem)}</Root>;
    }
}
