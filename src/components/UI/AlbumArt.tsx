import React from "react";

import ImageNotSupportedRoundedIcon from "@mui/icons-material/ImageNotSupportedRounded";

import { Image, Root } from "@components/UI/AlbumArt.styles";

import { MinimumAlbumArt } from "@utils/types";

export interface AlbumArtProps {
    size: number | string;
    target?: MinimumAlbumArt;
}

const AlbumArt = React.forwardRef(({ target, size }: AlbumArtProps, ref: React.Ref<HTMLDivElement>) => (
    <Root ref={ref} empty={!target} style={{ width: size, height: size }}>
        {target && <Image src={`cruise://${target.path}`} alt="Album Art" />}
        {!target && <ImageNotSupportedRoundedIcon />}
    </Root>
));

export default AlbumArt;
