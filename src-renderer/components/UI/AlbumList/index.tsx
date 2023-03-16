import React from "react";

import AlbumListItem from "@components/UI/AlbumList/Item";

import { AlbumListItem as AlbumListItemType } from "@utils/types";

import { Root } from "@components/UI/AlbumList/index.styles";

export interface AlbumListProps {
    subtitleType?: "artist" | "year";
    items: AlbumListItemType[];
    onPlay(item: AlbumListItemType): void;
    onClick(item: AlbumListItemType): void;
}
export interface AlbumListStates {}

export default class AlbumList extends React.Component<AlbumListProps, AlbumListStates> {
    private renderItem = (item: AlbumListItemType) => {
        const { onPlay, onClick, subtitleType } = this.props;

        return (
            <AlbumListItem onClick={onClick} onPlay={onPlay} key={item.id} item={item} subtitleType={subtitleType} />
        );
    };

    public render() {
        const { items } = this.props;

        return <Root>{items.map(this.renderItem)}</Root>;
    }
}
