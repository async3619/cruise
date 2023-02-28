import React from "react";

export interface NormalListItem {
    id: string;
    label: string;
    icon: React.ComponentType;
}
export type GapListItem = "gap";
export type SeparatorListItem = "separator";

export type ListItemType = NormalListItem | GapListItem | SeparatorListItem;
