import React from "react";

import ImageNotSupportedRoundedIcon from "@mui/icons-material/ImageNotSupportedRounded";

import { CircledRoot, Image, Root } from "@components/UI/AlbumArt.styles";

export interface AlbumArtProps {
    size: number | string;
    image?: string;
    shape?: "square" | "circle";
}

const AlbumArt = React.forwardRef(
    ({ image, size, shape = "square" }: AlbumArtProps, ref: React.Ref<HTMLDivElement>) => {
        const Component = shape === "circle" ? CircledRoot : Root;

        return (
            <Component ref={ref} empty={!image} style={{ width: size, height: size }}>
                {image && <Image src={image} alt="Album Art" />}
                {!image && <ImageNotSupportedRoundedIcon />}
            </Component>
        );
    },
);

export default AlbumArt;
