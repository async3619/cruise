import React from "react";

import { Image, Root } from "@components/ui/CollageView.styles";
import { ImageView } from "@components/ui/ImageView";
import { Grid } from "@mui/material";

export interface CollageViewProps {
    src: string[];
}

export function CollageView({ src }: CollageViewProps) {
    if (src.length === 0) {
        return <ImageView type="square" />;
    }

    let imageSrc = src;
    if (src.length > 4) {
        imageSrc = src.slice(0, 4);
    } else if (src.length === 3) {
        imageSrc = src.slice(0, 2);
    } else if (src.length === 2) {
        imageSrc = src.slice(0, 1);
    }

    return (
        <Root>
            <Grid container height="100%">
                {imageSrc.map((src, index) => (
                    <Grid key={index} item xs={imageSrc.length === 1 ? 12 : 6} position="relative">
                        <Image style={{ backgroundImage: `url(${src})` }} />
                    </Grid>
                ))}
            </Grid>
        </Root>
    );
}
