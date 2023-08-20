import React from "react";
import { Menu, MenuItem } from "ui";

import HomeRoundedIcon from "@mui/icons-material/HomeRounded";

import { Root } from "./SideBar.styles";

export interface SideBarProps {}

const SIDEBAR_NAV_ITEMS: MenuItem[] = [
    {
        id: "/",
        type: "button",
        label: "Home",
        icon: <HomeRoundedIcon />,
    },
];

export function SideBar({}: SideBarProps) {
    return (
        <Root>
            <Menu items={SIDEBAR_NAV_ITEMS} selectedId="/" />
        </Root>
    );
}
