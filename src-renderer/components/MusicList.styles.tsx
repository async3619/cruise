import React from "react";
import { Link } from "react-router-dom";

import { ButtonBase } from "@mui/material";

import styled from "@emotion/styled";
import { css } from "@emotion/react";

export interface AlbumArtProps extends React.ComponentProps<typeof ButtonBase> {
    active?: boolean;
}

export const AlbumArt = styled(({ active: _, ...rest }: AlbumArtProps) => <ButtonBase {...rest} />)<AlbumArtProps>`
    width: ${({ theme }) => theme.spacing(5.5)};
    height: ${({ theme }) => theme.spacing(5.5)};

    margin: ${({ theme }) => theme.spacing(0, 1.5, 0, 0.5)};
    border-radius: 4px;

    display: flex;
    align-items: center;
    justify-content: center;

    position: relative;
    overflow: hidden;

    color: white;
    background-size: cover;
    background-position: center;

    svg {
        width: ${({ theme }) => theme.spacing(3.5)};
        height: ${({ theme }) => theme.spacing(3.5)};

        position: relative;
        z-index: 2;

        opacity: ${({ active }) => (active ? 1 : 0)};
    }

    .MuiTouchRipple-root {
        z-index: 3;
    }

    &:before {
        content: "";

        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1;

        background: ${({ active }) => (active ? "rgba(0, 0, 0, 0.5)" : "transparent")};
    }
`;

export const Item = styled.div<{ odd?: boolean; active?: boolean }>`
    height: 100%;
    border-radius: 4px;

    display: flex;

    overflow: hidden;

    color: ${({ theme, active }) => (active ? theme.vars.palette.primary.main : theme.vars.palette.text.primary)};

    ${({ theme, odd }) =>
        odd
            ? css`
                  ${theme.getColorSchemeSelector("dark")} {
                      background: rgba(255, 255, 255, 0.025);
                  }

                  ${theme.getColorSchemeSelector("light")} {
                      background: rgba(0, 0, 0, 0.025);
                  }
              `
            : ``}

    &:hover {
        ${({ theme }) => theme.getColorSchemeSelector("dark")} {
            background: rgba(255, 255, 255, 0.075);
        }

        ${({ theme }) => theme.getColorSchemeSelector("light")} {
            background: rgba(0, 0, 0, 0.075);
        }

        ${AlbumArt} {
            &:before {
                background: rgba(0, 0, 0, 0.5);
            }

            svg {
                opacity: 1;
            }
        }
    }
`;

export const Cell = styled.div<{ width?: string; grow?: boolean; withoutPadding?: boolean }>`
    min-width: 0;

    flex-basis: ${({ width }) => width || "auto"};
    flex-grow: ${({ grow }) => (grow ? 1 : 0)};
    flex-shrink: 1;

    display: flex;
    align-items: center;

    &:not(:nth-of-type(1)):not(:nth-of-type(2)) {
        padding: ${({ theme }) => theme.spacing(0, 1)};
    }
`;

export const Label = styled.span`
    margin: 0;

    max-width: 100%;

    display: block;

    font-size: 0.9rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

export const LinkLabel = styled(Link)`
    max-width: 100%;

    border-radius: 2px;

    display: block;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    font-size: 0.9rem;
    font-family: ${({ theme }) => theme.typography.fontFamily};
    line-height: 1;
    text-decoration: none;

    color: inherit;

    &:hover {
        text-decoration: underline;
    }
`;
