import { Link } from "react-router-dom";

import { ButtonBase, ButtonProps } from "@mui/material";
import styled from "@emotion/styled";
import { backgroundColors } from "@styles/theme";

export interface ItemProps extends ButtonProps {
    component?: typeof Link;
    to?: string;
    selected?: boolean;
}

export const Item = styled(ButtonBase)<ItemProps>`
    min-width: 0;
    min-height: ${({ theme }) => theme.spacing(4.5)};

    margin: 0;
    padding: ${({ theme }) => theme.spacing(0.75, 1)};
    border-radius: 4px;

    display: flex;
    justify-content: flex-start;
    align-items: center;

    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-size: 0.875rem;
    font-weight: 600;

    color: ${({ theme, selected }) => (selected ? theme.vars.palette.text.primary : theme.vars.palette.text.secondary)};
    background: ${({ theme, selected }) => (selected ? theme.vars.palette.action.hover : "transparent")};

    transition: ${({ theme }) => theme.transitions.create(["color", "background"])};

    > svg {
        margin-right: ${({ theme }) => theme.spacing(1)};

        display: block;

        transition: ${({ theme }) => theme.transitions.create(["color"])};

        ${({ theme }) => theme.getColorSchemeSelector("dark")} {
            color: ${({ theme, selected }) =>
                selected ? theme.vars.palette.primary.light : theme.vars.palette.text.secondary};
        }

        ${({ theme }) => theme.getColorSchemeSelector("light")} {
            color: ${({ theme, selected }) =>
                selected ? theme.vars.palette.primary.dark : theme.vars.palette.text.secondary};
        }
    }

    > p {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    &:hover,
    &:focus {
        color: ${({ theme }) => theme.vars.palette.text.primary};
        background: ${({ theme }) => theme.vars.palette.action.hover};

        > svg {
            ${({ theme }) => theme.getColorSchemeSelector("dark")} {
                color: ${({ theme, selected }) =>
                    selected ? theme.vars.palette.primary.light : theme.vars.palette.text.primary};
            }

            ${({ theme }) => theme.getColorSchemeSelector("light")} {
                color: ${({ theme, selected }) =>
                    selected ? theme.vars.palette.primary.dark : theme.vars.palette.text.primary};
            }
        }
    }
`;

export const Title = styled.p`
    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-size: 0.875rem;
    font-weight: 600;
`;

export const Root = styled.div`
    width: 220px;

    padding: ${({ theme }) => theme.spacing(0.75)};
    border-radius: 4px;

    background: ${backgroundColors["950"]};
`;
