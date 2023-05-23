import React from "react";

import AlbumRoundedIcon from "@mui/icons-material/AlbumRounded";
import Person2RoundedIcon from "@mui/icons-material/Person2Rounded";

import { CircularRoot, SquareRoot } from "./ImageView.styles";

export interface ImageViewProps {
    type: "square" | "circle";
    className?: string;
    src?: string;
}

export function ImageView({ type, className, src }: ImageViewProps) {
    const Root = type === "square" ? SquareRoot : CircularRoot;
    const Icon = type === "square" ? AlbumRoundedIcon : Person2RoundedIcon;

    return (
        <Root className={className} style={{ backgroundImage: src ? `url(${src})` : undefined }}>
            {!src && <Icon />}
        </Root>
    );
}
