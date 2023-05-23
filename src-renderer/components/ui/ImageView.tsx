import React from "react";

import AlbumRoundedIcon from "@mui/icons-material/AlbumRounded";
import Person2RoundedIcon from "@mui/icons-material/Person2Rounded";

import { CircularRoot, SquareRoot } from "./ImageView.styles";

export interface ImageViewProps {
    type: "square" | "circle";
    className?: string;
    src?: string;
}

export const ImageView = React.forwardRef(
    ({ type, className, src }: ImageViewProps, ref: React.Ref<HTMLDivElement>) => {
        const Root = type === "square" ? SquareRoot : CircularRoot;
        const Icon = type === "square" ? AlbumRoundedIcon : Person2RoundedIcon;

        return (
            <Root ref={ref} className={className} style={{ backgroundImage: src ? `url(${src})` : undefined }}>
                {!src && <Icon />}
            </Root>
        );
    },
);
