import styled from "@emotion/styled";

export type WindowControlButtonTypes = "minimize" | "maximize" | "close";

export const Root = styled.button<{ buttonType: WindowControlButtonTypes }>`
    width: 30px;
    height: 26px;

    margin: 0;
    padding: 0;
    border: 0;

    display: flex;
    justify-content: center;
    align-items: center;

    font-family: inherit;
    font-size: inherit;

    color: ${({ theme }) => theme.palette.text.secondary};
    background-color: transparent;

    -webkit-app-region: no-drag;
    outline: none;

    &:hover,
    &:focus-visible {
        color: ${({ theme, buttonType }) =>
            buttonType === "close" ? theme.palette.error.contrastText : theme.palette.text.primary};
        background-color: ${({ theme, buttonType }) =>
            buttonType === "close" ? theme.palette.error.dark : "rgba(255, 255, 255, 0.08)"};
    }

    &:active {
        color: ${({ theme, buttonType }) =>
            buttonType === "close" ? theme.palette.error.contrastText : theme.palette.text.primary};
        background-color: ${({ theme, buttonType }) =>
            buttonType === "close" ? theme.palette.error.dark : "rgba(255, 255, 255, 0.12)"};
    }
`;

export const Icon = styled.svg`
    width: 10px;
    height: 10px;

    display: block;

    > * {
        fill: currentColor;
    }
`;
