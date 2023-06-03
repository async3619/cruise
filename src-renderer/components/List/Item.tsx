import React from "react";
import parse from "autosuggest-highlight/parse";

import { Typography } from "@mui/material";

import { Root } from "@components/List/Item.styles";

export interface ListItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
    icon?: React.ComponentType;
    parts?: ReturnType<typeof parse>;
    label: string;
}

export function ListItem({ label, icon: Icon, parts, ...rest }: ListItemProps) {
    return (
        <Root {...rest}>
            {Icon && <Icon />}
            <Typography variant="body1" fontSize="inherit">
                {parts?.map((part, index) => (
                    <span key={index} className={part.highlight ? "highlight" : undefined}>
                        {part.text}
                    </span>
                )) || label}
            </Typography>
        </Root>
    );
}
