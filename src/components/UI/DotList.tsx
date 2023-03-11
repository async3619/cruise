import React from "react";

import { Typography } from "@mui/material";

import { ItemLabel, Root } from "@components/UI/DotList.styles";

export interface DotListProps extends React.ComponentProps<typeof Typography> {
    items: string[];
}

export default function DotList({ items, ...rest }: DotListProps) {
    return (
        <Root>
            {items.map((item, index) => (
                <Typography component={ItemLabel} key={index} {...rest}>
                    {item}
                </Typography>
            ))}
        </Root>
    );
}
