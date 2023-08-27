import styled from "@emotion/styled";
import { backgroundColors } from "ui";
import { css } from "@emotion/react";
import { ButtonBase } from "@mui/material";

export const Root = styled.div`
    margin: 0;
    padding: 0;
`;

export const Column = styled.div<{ columnWidth: string }>`
    width: ${({ columnWidth }) => columnWidth};
    height: ${({ theme }) => theme.spacing(7)};

    min-width: 0;

    display: flex;
    align-items: center;
    flex: 1 1 ${({ columnWidth }) => columnWidth};

    &:not(:last-of-type) {
        margin-right: ${({ theme }) => theme.spacing(1)};
    }

    &:first-of-type {
        flex: 0 0 ${({ columnWidth }) => columnWidth};
    }
`;

export const Label = styled.p`
    width: 100%;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

export const PlayPauseButton = styled(ButtonBase, { shouldForwardProp: prop => prop !== "active" })<{
    active?: boolean;
}>`
    width: ${({ theme }) => theme.spacing(5.5)};
    height: ${({ theme }) => theme.spacing(5.5)};

    border-radius: ${({ theme }) => theme.shape.borderRadius}px;

    position: relative;
    overflow: hidden;

    display: flex;
    align-items: center;
    justify-content: center;

    background: center no-repeat;
    background-size: cover;

    > svg {
        position: relative;
        z-index: 1;

        opacity: 0;
    }

    &:before {
        content: "";

        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;

        background-color: rgba(0, 0, 0, 0.5);
        opacity: 0;
    }
`;

export const Item = styled.div<{ odd: boolean }>`
    margin: 0;
    padding: ${({ theme }) => theme.spacing(0, 2, 0, 0.75)};
    border-radius: ${({ theme }) => theme.shape.borderRadius}px;

    display: flex;

    ${({ odd, theme }) => {
        if (odd) {
            return "";
        }

        return css`
            ${theme.getColorSchemeSelector("dark")} {
                background-color: ${backgroundColors["900"]};
            }

            ${theme.getColorSchemeSelector("light")} {
                background-color: ${backgroundColors["50"]};
            }
        `;
    }}

    &:hover {
        ${({ theme }) => theme.getColorSchemeSelector("dark")} {
            background-color: ${backgroundColors["900"]};
        }

        ${({ theme }) => theme.getColorSchemeSelector("light")} {
            background-color: ${backgroundColors["100"]};
        }

        ${PlayPauseButton} {
            &:before,
            > svg {
                opacity: 1;
            }
        }
    }
`;
