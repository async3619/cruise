import React from "react";

export function stopPropagation(event: React.SyntheticEvent) {
    event.stopPropagation();
}
