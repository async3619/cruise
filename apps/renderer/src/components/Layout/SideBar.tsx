import React from "react";
import { Scrollbars } from "rc-scrollbars";

import { Menu, MenuItem } from "ui";

import HomeRoundedIcon from "@mui/icons-material/HomeRounded";

import { ScrollbarThumb } from "@components/ScrollbarThumb";
import { Content, Root } from "@components/Layout/SideBar.styles";

const SIDEBAR_NAV_ITEMS: MenuItem[] = [
    {
        id: "/",
        type: "button",
        label: "Home",
        icon: <HomeRoundedIcon />,
    },
];

export function SideBar() {
    return (
        <Root>
            <Scrollbars
                autoHide
                renderView={props => <Content {...props} />}
                renderThumbVertical={props => <ScrollbarThumb {...props} />}
            >
                <Menu items={SIDEBAR_NAV_ITEMS} />
            </Scrollbars>
        </Root>
    );
}
