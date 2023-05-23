import styled from "@emotion/styled";
import { Button as MuiButton } from "@mui/material";

export const Root = styled(MuiButton)`
    min-width: 0;
    max-width: 100%;

    display: flex;
    align-items: center;

    font-weight: 600;

    > svg {
        margin-right: ${({ theme }) => theme.spacing(1)};

        display: block;
    }
`;
