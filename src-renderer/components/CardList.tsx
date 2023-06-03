import React from "react";

import { FreeMode } from "swiper";
import { Swiper } from "swiper/react";

import { Card } from "@components/Card";

import { MinimalAlbumFragment, MinimalArtistFragment } from "@queries";

import { HorizontalCard, HorizontalSlide, VerticalRoot } from "@components/CardList.styles";

import { isAlbum } from "@utils/media";

export interface CardListProps {
    items: Array<MinimalAlbumFragment | MinimalArtistFragment>;
    direction?: "horizontal" | "vertical";
    onPlay?(item: MinimalAlbumFragment | MinimalArtistFragment): void;
}

export function CardList({ items, direction = "vertical", onPlay }: CardListProps) {
    const CardComponent = direction === "horizontal" ? HorizontalCard : Card;
    let children = items.map(item => {
        if (isAlbum(item)) {
            return <CardComponent key={item.id} item={item} href={`/albums/${item.id}`} onPlay={onPlay} />;
        } else {
            return <CardComponent key={item.id} item={item} href={`/artists/${item.id}`} onPlay={onPlay} />;
        }
    });

    if (direction === "horizontal") {
        children = children.map((item, index) => {
            return <HorizontalSlide key={items[index].id}>{item}</HorizontalSlide>;
        });
    }

    if (direction === "horizontal") {
        return <Swiper slidesPerView="auto" freeMode modules={[FreeMode]} children={children} />;
    }

    return <VerticalRoot children={children} />;
}
