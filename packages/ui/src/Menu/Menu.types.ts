import React from "react";

export interface BaseMenuItem {
    label: string;
}

export interface IconButtonItem {
    icon: React.ReactNode;
    tooltip: string;
    onClick(): void;
}

export interface LabelMenuItem extends BaseMenuItem {
    type: "label";
}
export interface ButtonMenuItem extends BaseMenuItem {
    type: "button";
    id: string;
    icon: React.ReactNode;
    onClick?: () => void;
    iconButtons?: IconButtonItem[];
}
export interface DividerMenuItem {
    type: "divider";
}

export type MenuItem = LabelMenuItem | ButtonMenuItem | DividerMenuItem;
