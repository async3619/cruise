import React from "react";

export interface BaseMenuItem {
    label: string;
}

export interface LabelMenuItem extends BaseMenuItem {
    type: "label";
}
export interface ButtonMenuItem extends BaseMenuItem {
    type: "button";
    id: string;
    icon: React.ReactNode;
}

export type MenuItem = LabelMenuItem | ButtonMenuItem;
