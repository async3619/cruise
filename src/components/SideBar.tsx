import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import List from "@components/List";
import { NormalListItem } from "@components/List/index.types";
import { Root } from "@components/SideBar.styles";

import { NAVIGATION_ITEMS } from "@constants/navigation";

export default function SideBar() {
    const navigate = useNavigate();
    const location = useLocation();

    const handleClick = React.useCallback(
        (item: NormalListItem) => {
            navigate(item.id);
        },
        [navigate],
    );

    const selectedItem = React.useMemo(() => {
        return NAVIGATION_ITEMS.find(item => typeof item !== "string" && item.id === location.pathname);
    }, [location]);

    return (
        <Root>
            <List items={NAVIGATION_ITEMS} onClick={handleClick} selectedItem={selectedItem} />
        </Root>
    );
}
