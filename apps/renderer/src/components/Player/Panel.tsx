import React from "react";

import { PlayerControl } from "@components/Player/Control";
import { Root } from "@components/Player/Panel.styles";

export interface PlayerPanelProps {}

export function PlayerPanel({}: PlayerPanelProps) {
    return (
        <Root data-testid="PlayerPanel">
            <PlayerControl />
        </Root>
    );
}
