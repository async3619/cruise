import React from "react";

import Page from "@components/Page";

import { Root } from "@pages/Musics.styles";

export interface MusicProps {}
export interface MusicStates {}

export default class Musics extends React.Component<MusicProps, MusicStates> {
    public render() {
        return (
            <Page title="Musics">
                <Root>
                    <span>Musics</span>
                </Root>
            </Page>
        );
    }
}
