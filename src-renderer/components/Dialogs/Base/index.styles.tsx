import styled from "@emotion/styled";
import { DialogActions } from "@mui/material";

export const Root = styled.div`
    margin: 0;
    padding: ${({ theme }) => theme.spacing(2, 3)};
`;

export const Footer = styled(DialogActions)`
    padding: ${({ theme }) => theme.spacing(2)};

    background: #f3f3f3;
`;
