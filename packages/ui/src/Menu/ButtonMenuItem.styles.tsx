import styled from "@emotion/styled";

export const Icon = styled.span<{ active?: boolean }>`
    margin-right: ${({ theme }) => theme.spacing(1.5)};

    display: block;

    color: ${({ theme, active }) => (active ? theme.palette.primary.light : theme.palette.text.secondary)};

    > svg {
        display: block;
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

    color: ${({ theme, active }) => (active ? theme.palette.text.primary : theme.palette.text.secondary)};
    background-color: ${({ theme, active }) => (active ? theme.palette.action.hover : "transparent")};

    cursor: pointer;
    outline: none;

    transition: ${({ theme }) =>
        theme.transitions.create(["color", "background-color", "box-shadow"], {
            duration: theme.transitions.duration.shortest,
        })};

    &:hover,
    &:focus-visible {
        color: ${({ theme }) => theme.palette.text.primary};
        background-color: ${({ theme }) => theme.palette.action.hover};
    }

    &:focus-visible {
        box-shadow: 0 0 0 2px ${({ theme }) => theme.palette.primary.main};
    }

    &:active {
        color: ${({ theme }) => theme.palette.text.primary};
        background-color: ${({ theme }) => theme.palette.action.selected};
    }
`;
