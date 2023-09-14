import styled from "@emotion/styled";
import { ButtonBase } from "@mui/material";

export const Root = styled.div<{ withoutBorder: boolean }>`
    margin: 0;
    padding: 0;
    border: ${({ theme, withoutBorder }) => (withoutBorder ? "0" : `1px solid ${theme.vars.palette.divider}`)};
    border-radius: ${({ theme }) => theme.shape.borderRadius}px;

    display: flex;
    align-items: center;
    justify-content: center;

    position: relative;

    overflow: hidden;

    aspect-ratio: 1 / 1;
`;

export const ButtonRoot = styled(ButtonBase, {
    shouldForwardProp: prop => prop !== "withoutBorder",
})<{ withoutBorder: boolean }>`
    margin: 0;
    padding: 0;
    border: ${({ theme, withoutBorder }) => (withoutBorder ? "0" : `1px solid ${theme.vars.palette.divider}`)};
    border-radius: ${({ theme }) => theme.shape.borderRadius}px;

    display: flex;
    align-items: center;
    justify-content: center;

    position: relative;

    overflow: hidden;

    aspect-ratio: 1 / 1;

    &:focus-visible {
        box-shadow: 0 0 0 2px ${({ theme }) => theme.vars.palette.primary.main};
    }
`;

export const Background = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    > svg {
        display: block;

        opacity: 0.5;
    }
`;

export const Image = styled.img`
    width: 100%;
    height: 100%;

    display: block;
`;

export const Overlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    z-index: 2;

    display: flex;
    align-items: center;
    justify-content: center;
`;
