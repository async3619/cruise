import styled from "@emotion/styled";
import { ButtonBase } from "@mui/material";

export const Root = styled.div`
    margin: 0;
    padding: 0;

    display: flex;
`;

export const Item = styled(ButtonBase, { shouldForwardProp: prop => prop !== "active" })<{ active?: boolean }>`
    padding: ${({ theme }) => theme.spacing(1)};
    border-radius: ${({ theme }) => theme.shape.borderRadius}px;
    border-bottom-left-radius: ${({ theme, active }) => (active ? 0 : theme.shape.borderRadius)}px;
    border-bottom-right-radius: ${({ theme, active }) => (active ? 0 : theme.shape.borderRadius)}px;

    overflow: hidden;
    position: relative;

    color: ${({ theme, active }) => (active ? theme.palette.primary.light : theme.palette.text.disabled)};

    > svg {
        display: block;
    }

    &:before {
        content: "";

        height: 2px;

        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;

        background-color: ${({ theme, active }) => (active ? theme.palette.primary.light : "transparent")};
    }
`;
