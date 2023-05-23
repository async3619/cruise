import styled from "@emotion/styled";
import { Button as MuiButton } from "@mui/material";

export const Root = styled(MuiButton)`
    display: flex;
    align-items: center;

    font-weight: 600;

    > svg {
        margin-right: ${({ theme }) => theme.spacing(1)};

        display: block;
    }
`;
