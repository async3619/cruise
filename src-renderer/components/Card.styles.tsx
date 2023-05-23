import { Link } from "react-router-dom";
import styled from "@emotion/styled";

import { ButtonBase, Fab } from "@mui/material";

import { ImageView } from "@components/ui/ImageView";

import { backgroundColors } from "@styles/theme";
import { ExtendComponentProps } from "@utils/types";

export const Image = styled(ImageView)`
    box-shadow: ${({ theme }) => theme.shadows[4]};

    transition: ${({ theme }) =>
        theme.transitions.create(["box-shadow"], {
            duration: theme.transitions.duration.shortest,
        })};
`;

export const Title = styled.p`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

export const Subtitle = styled.p`
    margin-top: ${({ theme }) => theme.spacing(0.25)} !important;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    ${({ theme }) => theme.getColorSchemeSelector("light")} {
        font-weight: 600 !important;
    }
`;

export const PlayButton = styled(Fab)`
    position: absolute;
    right: ${({ theme }) => theme.spacing(1.5)};
    bottom: ${({ theme }) => theme.spacing(1.5)};

    z-index: 1;

    opacity: 0;

    transition: ${({ theme }) =>
        theme.transitions.create(["opacity", "transform"], {
            duration: theme.transitions.duration.short,
        })};

    transform: scale(0.75);
    transform-origin: center center;
`;

export const Root = styled(ButtonBase)<ExtendComponentProps<typeof ButtonBase, { component: "div" | "span" }>>`
    min-width: 0;
    width: 190px;

    margin: ${({ theme }) => theme.spacing(0, 2, 2, 0)};
    padding: ${({ theme }) => theme.spacing(2)};
    border-radius: 4px;

    display: flex;
    flex-direction: column;
    align-items: stretch;

    text-align: left;

    transition: ${({ theme }) =>
        theme.transitions.create(["background-color"], {
            duration: theme.transitions.duration.shortest,
        })};

    ${({ theme }) => theme.getColorSchemeSelector("dark")} {
        background-color: ${backgroundColors["900"]};
    }

    &:hover,
    &:focus {
        ${({ theme }) => theme.getColorSchemeSelector("dark")} {
            background-color: ${backgroundColors["700"]};
        }

        ${({ theme }) => theme.getColorSchemeSelector("light")} {
            background-color: ${backgroundColors["100"]};
        }

        ${Image} {
            box-shadow: ${({ theme }) => theme.shadows[12]};
        }

        ${PlayButton} {
            opacity: 1;
            transform: scale(1);
        }
    }
`;

export const Wrapper = styled(Link)`
    color: inherit;
    text-decoration: none;
`;
