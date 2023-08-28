import React from "react";

import { Player } from "@components/Player/Provider";

export const PlayerContext = React.createContext<Player | null>(null);

export function usePlayer() {
    const context = React.useContext(PlayerContext);
    if (!context) {
        throw new Error("usePlayer must be used within a <PlayerProvider />");
    }

    return context;
}
