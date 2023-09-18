import React from "react";
import { Nullable } from "types";

import { Background, ButtonRoot, Image, Overlay, Root } from "@components/AlbumArt.styles";
import AlbumIcon from "@mui/icons-material/Album";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";

import { MinimalAlbumArt } from "@utils/types";

export interface AlbumArtProps {
    albumArt: Nullable<MinimalAlbumArt>;
    className?: string;
    withoutBorder?: boolean;

    isArtist?: boolean;
    onClick?: (e: React.MouseEvent<any>) => void;

    children?: React.ReactNode;
}

export function AlbumArt({
    className,
    albumArt,
    withoutBorder = false,
    isArtist = false,
    children,
    onClick,
}: AlbumArtProps) {
    const RootComponent = onClick ? ButtonRoot : Root;

    return (
        <RootComponent rounded={isArtist} className={className} withoutBorder={withoutBorder} onClick={onClick}>
            <Background>
                {albumArt && <Image src={albumArt.url} />}
                {!albumArt && (
                    <>
                        {!isArtist && <AlbumIcon />}
                        {isArtist && <PersonRoundedIcon />}
                    </>
                )}
            </Background>
            {children && <Overlay>{children}</Overlay>}
        </RootComponent>
    );
}
