import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
    const location = useLocation();
    const navigate = useNavigate();

    const handleClick = React.useCallback(
        (item: MenuItem) => {
            if (item.type !== "button") {
                return;
            }

            navigate(item.id);
        },
        [navigate],
    );

    return (
        <Root>
            <Scrollbars
                autoHide
                renderView={props => <Content {...props} />}
                renderThumbVertical={props => <ScrollbarThumb {...props} />}
            >
                <Menu items={SIDEBAR_NAV_ITEMS} selectedId={location.pathname} onClick={handleClick} />
            </Scrollbars>
        </Root>
    );
}
