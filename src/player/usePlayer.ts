import React from "react";
import { PlayerContext } from "@player/context";

export default function usePlayer() {
    return React.useContext(PlayerContext);
}
