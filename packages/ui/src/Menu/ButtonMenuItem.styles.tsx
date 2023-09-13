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
    padding: ${({ theme }) => theme.spacing(0, 0.75, 0, 1)};
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

    .icon-buttons {
        opacity: 0;

        transition: ${({ theme }) =>
            theme.transitions.create("opacity", {
                duration: theme.transitions.duration.shortest,
            })};
    }

    &:hover,
    &:focus-visible {
        color: ${({ theme }) => theme.vars.palette.text.primary};
    }

    &:hover,
    &:focus-visible,
    &:focus-within {
        .icon-buttons {
            opacity: 1;
        }
    }

    &:focus-visible {
        box-shadow: 0 0 0 2px ${({ theme }) => theme.vars.palette.primary.main};
    }

    &:active:not(:has(:active)) {
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

        &:active:not(:has(:active)) {
            background-color: ${({ theme }) => theme.vars.palette.action.selected};
        }
    }

    ${({ theme }) => theme.getColorSchemeSelector("light")} {
        background-color: ${({ theme, active }) => (active ? theme.vars.palette.action.selected : "transparent")};

        &:hover,
        &:focus-visible {
            background-color: ${({ theme }) => theme.vars.palette.action.selected};
        }

        &:active:not(:has(:active)) {
            background-color: ${({ theme }) => theme.vars.palette.action.focus};
        }
    }
`;

export const IconButton = styled.span`
    margin: 0;
    padding: ${({ theme }) => theme.spacing(0.25)};
    border: 0;
    border-radius: ${({ theme }) => theme.shape.borderRadius}px;

    color: ${({ theme }) => theme.vars.palette.text.disabled};
    background-color: transparent;

    cursor: pointer;
    outline: none;

    transition: ${({ theme }) =>
        theme.transitions.create("color", {
            duration: theme.transitions.duration.shortest,
        })};

    > svg {
        font-size: ${({ theme }) => theme.spacing(2.5)};

        display: block;
    }

    &:hover,
    &:focus-visible {
        color: ${({ theme }) => theme.vars.palette.text.secondary};
    }

    &:focus-visible {
        box-shadow: 0 0 0 2px ${({ theme }) => theme.vars.palette.primary.main};
    }
`;
