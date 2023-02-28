import React from "react";

import { Root } from "@pages/Home.styles";

export interface HomeProps {}
export interface HomeStates {}

export default class Home extends React.Component<HomeProps, HomeStates> {
    public state: HomeStates = {};

    public render() {
        return <Root></Root>;
    }
}
