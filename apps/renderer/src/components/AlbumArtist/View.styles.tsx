import styled from "@emotion/styled";

import { backgroundColors } from "ui";
import { darken } from "@mui/material";

export const Image = styled.div<{ circular?: boolean }>`
    width: ${({ theme }) => theme.spacing(22)};
    height: ${({ theme }) => theme.spacing(22)};
    border-radius: ${({ circular }) => (circular ? "50%" : "0")};

    display: flex;
    align-items: center;
    justify-content: center;

    position: relative;

    background-size: cover;
    background-position: center;

    box-shadow: ${({ theme }) => theme.shadows[4]};

    transition: ${({ theme }) =>
        theme.transitions.create(["box-shadow"], {
            duration: theme.transitions.duration.shortest,
        })};

    ${({ theme }) => theme.getColorSchemeSelector("dark")} {
        background-color: ${backgroundColors["950"]};
    }

    ${({ theme }) => theme.getColorSchemeSelector("light")} {
        background-color: ${backgroundColors["100"]};
    }
`;

export const Metadata = styled.div`
    margin: ${({ theme }) => theme.spacing(1.5, 0, 0)};
    padding: 0;

    > p {
        width: ${({ theme }) => theme.spacing(22)};

        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
`;

export const PlayButton = styled.div`
    position: absolute;
    right: ${({ theme }) => theme.spacing(1)};
    bottom: ${({ theme }) => theme.spacing(1)};

    opacity: 0;
    transform: scale(0);

    transition: ${({ theme }) =>
        theme.transitions.create(["opacity", "transform"], {
            duration: theme.transitions.duration.shortest,
        })};

    &:has(:focus-visible) {
        opacity: 1;
        transform: scale(1);
    }
`;

export const CheckBoxWrapper = styled.div<{ visible: boolean }>`
    padding: ${({ theme }) => theme.spacing(0.5)};

    position: absolute;
    top: 0;
    left: 0;

    background-color: rgba(0, 0, 0, 0.75);
    opacity: ${({ visible }) => (visible ? 1 : 0)};

    transition: ${({ theme }) =>
        theme.transitions.create(["opacity"], {
            duration: theme.transitions.duration.shortest,
        })};

    &:has(:focus-visible) {
        opacity: 1;
    }
`;

export const ImageIcon = styled.div`
    display: flex;
    justify-content: center;

    color: ${({ theme }) => theme.palette.text.disabled};

    > svg {
        width: 35%;
        height: 35%;

        display: block;
    }
`;

export const Root = styled.div`
    margin: ${({ theme }) => theme.spacing(0, 1.5, 1.5, 0)};
    padding: ${({ theme }) => theme.spacing(1.5)};
    border: 0;
    border-radius: ${({ theme }) => theme.shape.borderRadius}px;

    text-align: left;

    color: inherit;
    cursor: pointer;

    outline: none;

    transition: ${({ theme }) =>
        theme.transitions.create(["background-color"], {
            duration: theme.transitions.duration.shortest,
        })};

    ${({ theme }) => theme.getColorSchemeSelector("dark")} {
        background-color: ${backgroundColors["900"]};
    }

    ${({ theme }) => theme.getColorSchemeSelector("light")} {
        background-color: ${backgroundColors["50"]};
    }

    &:hover,
    &:focus-visible {
        ${({ theme }) => theme.getColorSchemeSelector("dark")} {
            background-color: ${darken(backgroundColors["900"], 0.1)};
        }

        ${({ theme }) => theme.getColorSchemeSelector("light")} {
            background-color: ${darken(backgroundColors["50"], 0.1)};
        }

        ${Image} {
            box-shadow: ${({ theme }) => theme.shadows[16]};
        }
    }

    &:focus-visible,
    &:hover {
        ${PlayButton} {
            opacity: 1;
            transform: scale(1);
        }

        ${CheckBoxWrapper} {
            opacity: 1;
        }
    }
`;
