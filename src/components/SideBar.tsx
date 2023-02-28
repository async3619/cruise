import React from "react";

import List from "@components/List";
import { Root } from "@components/SideBar.styles";

import { NAVIGATION_ITEMS } from "@constants/navigation";

export interface SideBarProps {}
export interface SideBarStates {}

export default class SideBar extends React.Component<SideBarProps, SideBarStates> {
    public render() {
        return (
            <Root>
                <List items={NAVIGATION_ITEMS} />
            </Root>
        );
    }
}
