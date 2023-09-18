import styled from "@emotion/styled";
import { ButtonBase } from "@mui/material";

export const Root = styled.div<{ withoutBorder: boolean; rounded?: boolean }>`
    margin: 0;
    padding: 0;
    border: ${({ theme, withoutBorder }) => (withoutBorder ? "0" : `1px solid ${theme.vars.palette.divider}`)};
    border-radius: ${({ theme, rounded }) => (rounded ? "100%" : `${theme.shape.borderRadius}px`)};

    display: flex;
    align-items: center;
    justify-content: center;

    position: relative;

    overflow: hidden;

    aspect-ratio: 1 / 1;
`;

export const ButtonRoot = styled(ButtonBase, {
    shouldForwardProp: prop => prop !== "withoutBorder" && prop !== "rounded",
})<{ withoutBorder: boolean; rounded?: boolean }>`
    margin: 0;
    padding: 0;
    border: ${({ theme, withoutBorder }) => (withoutBorder ? "0" : `1px solid ${theme.vars.palette.divider}`)};
    border-radius: ${({ theme, rounded }) => (rounded ? "100%" : `${theme.shape.borderRadius}px`)};

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

    color: ${({ theme }) => theme.vars.palette.text.disabled};

    > svg {
        width: 35%;
        height: 35%;

        display: block;
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
