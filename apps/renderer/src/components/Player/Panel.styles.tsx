import { backgroundColors } from "ui";

import styled from "@emotion/styled";
import { ButtonBase } from "@mui/material";

import { AlbumArt } from "@components/AlbumArt";

export const Root = styled.div`
    height: ${({ theme }) => theme.spacing(11)};

    margin: 0;
    padding: ${({ theme }) => theme.spacing(1)};
    border-top: 1px solid ${({ theme }) => theme.vars.palette.divider};

    display: flex;
    justify-content: center;
    align-items: center;

    transition: ${({ theme }) =>
        theme.transitions.create("background-color", {
            duration: theme.transitions.duration.shortest,
        })};

    ${({ theme }) => theme.getColorSchemeSelector("dark")} {
        background: ${backgroundColors["950"]};
    }

    ${({ theme }) => theme.getColorSchemeSelector("light")} {
        background: ${backgroundColors["100"]};
    }
`;

export const Section = styled.div`
    min-width: 0;

    height: 100%;

    display: flex;
    align-items: center;

    flex: 1 1;
`;

export const NowPlaying = styled(ButtonBase)`
    min-width: 0;
    max-width: 100%;

    padding-right: ${({ theme }) => theme.spacing(1.5)};
    border-radius: ${({ theme }) => theme.shape.borderRadius}px;

    display: flex;
    justify-content: flex-start;
    flex: 1 1;

    text-align: left;
`;

export const AlbumArtView = styled(AlbumArt)`
    min-width: 0;

    width: ${({ theme }) => theme.spacing(9)};
    margin: ${({ theme }) => theme.spacing(0, 1.5, 0, 0)};

    flex: 0 0 ${({ theme }) => theme.spacing(9)};
`;

export const Description = styled.div`
    width: calc(100% - ${({ theme }) => theme.spacing(9 + 1.5)});
`;
