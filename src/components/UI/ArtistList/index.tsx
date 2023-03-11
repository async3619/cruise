import React from "react";

import ArtistListItem from "@components/UI/ArtistList/Item";
import { Root } from "@components/UI/ArtistList/index.styles";

import { ArtistListItem as ArtistListItemType } from "@utils/types";

export interface ArtistListProps {
    items: ArtistListItemType[];
    onPlay(item: ArtistListItemType): void;
}
export interface ArtistListStates {}

export default class ArtistList extends React.Component<ArtistListProps, ArtistListStates> {
    private renderItems = (item: ArtistListItemType) => {
        return <ArtistListItem item={item} key={item.id} onPlay={this.props.onPlay} />;
    };
    public render() {
        const { items } = this.props;

        return <Root>{items.map(this.renderItems)}</Root>;
    }
}
