import React from "react";

import { ButtonBase } from "@mui/material";

import styled from "@emotion/styled";

export interface AlbumArtProps extends React.ComponentProps<typeof ButtonBase> {
    active?: boolean;
}

export const AlbumArt = styled(({ active: _, ...rest }: AlbumArtProps) => <ButtonBase {...rest} />)<AlbumArtProps>`
    width: ${({ theme }) => theme.spacing(5.5)};
    height: ${({ theme }) => theme.spacing(5.5)};

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

export const Root = styled.table`
    width: 100%;

    margin: 0;
    padding: 0;
    border-spacing: 0;

    table-layout: fixed;

    td,
    th {
        padding: ${({ theme }) => theme.spacing(1, 1.5)};
        border-spacing: 0;

        &:first-of-type {
            width: ${({ theme }) => theme.spacing(5.5)};
        }
    }

    td {
        &:first-of-type {
            border-top-left-radius: 4px;
            border-bottom-left-radius: 4px;

            padding: ${({ theme }) => theme.spacing(0.75, 0, 0.75, 0.75)};
        }

        &:last-of-type {
            border-top-right-radius: 4px;
            border-bottom-right-radius: 4px;
        }
    }

    th {
        text-align: left;
        font-weight: inherit;
    }

    tbody {
        tr {
            &:nth-of-type(odd) {
                td {
                    ${({ theme }) => theme.getColorSchemeSelector("dark")} {
                        background: rgba(255, 255, 255, 0.025);
                    }

                    ${({ theme }) => theme.getColorSchemeSelector("light")} {
                        background: rgba(0, 0, 0, 0.025);
                    }
                }
            }

            &:hover {
                td {
                    ${({ theme }) => theme.getColorSchemeSelector("dark")} {
                        background: rgba(255, 255, 255, 0.075);
                    }

                    ${({ theme }) => theme.getColorSchemeSelector("light")} {
                        background: rgba(0, 0, 0, 0.075);
                    }
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
        }
    }
`;
