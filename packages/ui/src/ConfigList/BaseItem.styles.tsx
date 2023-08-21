import styled from "@emotion/styled";

import { backgroundColors } from "../theme";
import { lighten } from "@mui/material";

export const Root = styled.section<{ opened?: boolean }>`
    margin: 0;
    padding: 0;
    border: 1px solid ${({ theme }) => theme.vars.palette.divider};
    border-top-left-radius: ${({ theme }) => theme.shape.borderRadius}px;
    border-top-right-radius: ${({ theme }) => theme.shape.borderRadius}px;
    border-bottom-left-radius: ${({ theme, opened }) => (opened ? 0 : theme.shape.borderRadius)}px;
    border-bottom-right-radius: ${({ theme, opened }) => (opened ? 0 : theme.shape.borderRadius)}px;
`;

export const Header = styled.button<{ opened?: boolean }>`
    width: 100%;

    margin: 0;
    padding: 0;
    border: 0;
    border-top-left-radius: ${({ theme }) => theme.shape.borderRadius}px;
    border-top-right-radius: ${({ theme }) => theme.shape.borderRadius}px;
    border-bottom-left-radius: ${({ theme, opened }) => (opened ? 0 : theme.shape.borderRadius)}px;
    border-bottom-right-radius: ${({ theme, opened }) => (opened ? 0 : theme.shape.borderRadius)}px;

    display: flex;
    align-items: center;

    box-sizing: border-box;

    position: relative;
    z-index: 1;

    color: inherit;
    cursor: pointer;

    outline: none;

    transition: ${({ theme }) =>
        theme.transitions.create("background", {
            duration: theme.transitions.duration.shortest,
        })};

    ${({ theme }) => theme.getColorSchemeSelector("dark")} {
        background: ${backgroundColors["700"]};
    }

    ${({ theme }) => theme.getColorSchemeSelector("light")} {
    }

    &:hover,
    &:focus-visible {
        ${({ theme }) => theme.getColorSchemeSelector("dark")} {
            background: ${lighten(backgroundColors["700"], 0.05)};
        }
    }

    &:focus-visible {
        box-shadow: 0 0 0 2px ${({ theme }) => theme.vars.palette.primary.main};
    }
`;

export const Body = styled.div`
    transition: ${({ theme }) => theme.transitions.create("max-height")};

    overflow: hidden;

    transition: ${({ theme }) =>
        theme.transitions.create("background", { duration: theme.transitions.duration.shortest })};

    ${({ theme }) => theme.getColorSchemeSelector("dark")} {
        background: ${backgroundColors["900"]};
    }

    ${({ theme }) => theme.getColorSchemeSelector("light")} {
        background: ${backgroundColors["50"]};
    }
`;

export const Content = styled.div`
    padding: ${({ theme }) => theme.spacing(1.5, 7)};
    border-top: 1px solid ${({ theme }) => theme.vars.palette.divider};
`;

export const IconWrapper = styled.div`
    width: ${({ theme }) => theme.spacing(7)};
    height: ${({ theme }) => theme.spacing(7)};

    display: flex;
    align-items: center;
    justify-content: center;

    > svg {
        width: ${({ theme }) => theme.spacing(2.5)};
        height: ${({ theme }) => theme.spacing(2.5)};

        display: block;

        color: ${({ theme }) => theme.vars.palette.text.disabled};
    }
`;

export const Indicator = styled.div`
    width: ${({ theme }) => theme.spacing(7)};
    height: ${({ theme }) => theme.spacing(7)};

    display: flex;
    align-items: center;
    justify-content: center;
`;
