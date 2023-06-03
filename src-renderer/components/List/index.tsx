import React from "react";

import { Paper, Stack } from "@mui/material";

export interface ListProps extends Omit<React.HTMLAttributes<HTMLUListElement>, "children"> {
    children: React.ReactNode;
}

export const List = React.forwardRef(({ ...rest }: ListProps, ref: React.Ref<HTMLUListElement>) => (
    <Paper elevation={0}>
        <Stack component="ul" ref={ref} {...rest} spacing={0.5} sx={{ m: 0, px: 0.75, py: 0.75 }} />
    </Paper>
));
