import React from "react";

import ImageNotSupportedRoundedIcon from "@mui/icons-material/ImageNotSupportedRounded";

import { Image, Root } from "@components/UI/AlbumArt.styles";

export interface AlbumArtProps {
    size: number | string;
    image?: string;
}

const AlbumArt = React.forwardRef(({ image, size }: AlbumArtProps, ref: React.Ref<HTMLDivElement>) => (
    <Root ref={ref} empty={!image} style={{ width: size, height: size }}>
        {image && <Image src={image} alt="Album Art" />}
        {!image && <ImageNotSupportedRoundedIcon />}
    </Root>
));

export default AlbumArt;
