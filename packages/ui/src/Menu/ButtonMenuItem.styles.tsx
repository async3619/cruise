import styled from "@emotion/styled";

export const Icon = styled.span<{ active?: boolean }>`
    margin-right: ${({ theme }) => theme.spacing(1.5)};

    display: block;

    > svg {
        display: block;
    }

    ${({ theme }) => theme.getColorSchemeSelector("dark")} {
        color: ${({ theme, active }) =>
            active ? theme.vars.palette.primary.light : theme.vars.palette.text.secondary};
    }

    ${({ theme }) => theme.getColorSchemeSelector("light")} {
        color: ${({ theme, active }) => (active ? theme.vars.palette.primary.main : theme.vars.palette.text.secondary)};
    }
`;

export const Root = styled.button<{ active?: boolean }>`
    width: 100%;
    height: ${({ theme }) => theme.spacing(5)};

    margin: 0;
    padding: 0 ${({ theme }) => theme.spacing(1)};
    border: 0;
    border-radius: ${({ theme }) => theme.shape.borderRadius}px;

    display: flex;
    align-items: center;

    color: ${({ theme, active }) => (active ? theme.vars.palette.text.primary : theme.vars.palette.text.secondary)};
    background-color: transparent;

    cursor: pointer;
    outline: none;

    transition: ${({ theme }) =>
        theme.transitions.create(["color", "background-color", "box-shadow"], {
            duration: theme.transitions.duration.shortest,
        })};

    &:hover,
    &:focus-visible {
        color: ${({ theme }) => theme.vars.palette.text.primary};
    }

    &:focus-visible {
        box-shadow: 0 0 0 2px ${({ theme }) => theme.vars.palette.primary.main};
    }

    &:active {
        color: ${({ theme }) => theme.vars.palette.text.primary};
    }

    &:not(:last-of-type) {
        margin-bottom: ${({ theme }) => theme.spacing(0.5)};
    }

    ${({ theme }) => theme.getColorSchemeSelector("dark")} {
        background-color: ${({ theme, active }) => (active ? theme.vars.palette.action.hover : "transparent")};

        &:hover,
        &:focus-visible {
            background-color: ${({ theme }) => theme.vars.palette.action.hover};
        }

        &:active {
            background-color: ${({ theme }) => theme.vars.palette.action.selected};
        }
    }

    ${({ theme }) => theme.getColorSchemeSelector("light")} {
        background-color: ${({ theme, active }) => (active ? theme.vars.palette.action.selected : "transparent")};

        &:hover,
        &:focus-visible {
            background-color: ${({ theme }) => theme.vars.palette.action.selected};
        }

        &:active {
            background-color: ${({ theme }) => theme.vars.palette.action.focus};
        }
    }
`;
