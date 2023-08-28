import React from "react";
import { Nullable } from "types";

import { Background, ButtonRoot, Image, Overlay, Root } from "@components/AlbumArt.styles";
import AlbumIcon from "@mui/icons-material/Album";

import { MinimalAlbumArt } from "@utils/types";

export interface AlbumArtProps {
    albumArt: Nullable<MinimalAlbumArt>;
    className?: string;
    withoutBorder?: boolean;

    onClick?: () => void;

    children?: React.ReactNode;
}

export function AlbumArt({ className, albumArt, withoutBorder = false, children, onClick }: AlbumArtProps) {
    const RootComponent = onClick ? ButtonRoot : Root;

    return (
        <RootComponent className={className} withoutBorder={withoutBorder} onClick={onClick}>
            <Background>
                {albumArt && <Image src={albumArt.url} />}
                {!albumArt && <AlbumIcon />}
            </Background>
            {children && <Overlay>{children}</Overlay>}
        </RootComponent>
    );
}
