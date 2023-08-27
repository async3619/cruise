import { backgroundColors } from "ui";

import styled from "@emotion/styled";
import { css } from "@emotion/react";

import { AlbumArt } from "@components/AlbumArt";

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

export const PlayPauseButton = styled(AlbumArt)`
    width: 100%;
    color: white;

    svg {
        opacity: 0;
    }

    &:before {
        content: "";

        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1;

        display: block;
    }

    .MuiTouchRipple-root {
        z-index: 3;
    }
`;

export const Item = styled.div<{ odd: boolean; isActive: boolean }>`
    margin: 0;
    padding: ${({ theme }) => theme.spacing(0, 2, 0, 0.75)};
    border-radius: ${({ theme }) => theme.shape.borderRadius}px;

    display: flex;

    color: ${({ theme, isActive }) => (isActive ? theme.vars.palette.primary.main : theme.vars.palette.text.primary)};

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

    ${PlayPauseButton} {
        &:before {
            background: ${({ isActive }) => (isActive ? "rgba(0, 0, 0, 0.5)" : "transparent")};
        }

        svg {
            opacity: ${({ isActive }) => (isActive ? "1" : "0")};
        }
    }

    &:hover {
        ${({ theme }) => theme.getColorSchemeSelector("dark")} {
            background-color: ${backgroundColors["900"]};
        }

        ${({ theme }) => theme.getColorSchemeSelector("light")} {
            background-color: ${backgroundColors["100"]};
        }

        ${PlayPauseButton} {
            &:before {
                background: rgba(0, 0, 0, 0.5);
            }

            svg {
                opacity: 1;
            }
        }
    }
`;
