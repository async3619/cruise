import React from "react";

import { Root } from "@pages/Music.styles";

export interface MusicProps {}
export interface MusicStates {}

export default class Music extends React.Component<MusicProps, MusicStates> {
    public render() {
        return (
            <Root>
                <span>Music</span>
            </Root>
        );
    }
}
