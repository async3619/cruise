import styled from "@emotion/styled";
import { backgroundColors } from "ui";

export const Root = styled.div`
    width: 100%;
    height: ${({ theme }) => theme.spacing(5.5)};

    margin: 0;
    padding: ${({ theme }) => theme.spacing(0, 6)};
    border: 0;
    border-radius: ${({ theme }) => theme.spacing(2.75)};

    position: relative;

    &:has(> input:focus-visible) {
        box-shadow: inset 0 0 0 2px ${({ theme }) => theme.palette.primary.main};
    }

    ${({ theme }) => theme.getColorSchemeSelector("dark")} {
        color: white;
        background-color: ${backgroundColors["950"]};
    }

    ${({ theme }) => theme.getColorSchemeSelector("light")} {
        border: 1px solid ${({ theme }) => theme.palette.divider};

        color: black;
        background-color: ${backgroundColors["50"]};
    }
`;

export const Icon = styled.div`
    position: absolute;
    top: 0;
    left: ${({ theme }) => theme.spacing(2)};
    bottom: 0;

    display: flex;
    align-items: center;

    color: ${({ theme }) => theme.palette.text.disabled};
`;

export const Loading = styled.div`
    position: absolute;
    top: 0;
    right: ${({ theme }) => theme.spacing(2)};
    bottom: 0;

    display: flex;
    align-items: center;

    transition: ${({ theme }) => theme.transitions.create("opacity")};
`;

export const Input = styled.input`
    width: 100%;
    height: ${({ theme }) => theme.spacing(5.5)};

    margin: 0;
    padding: 0;
    border: 0;

    display: block;

    font-family: inherit;
    font-size: inherit;
    font-weight: inherit;

    color: inherit;
    background-color: transparent;

    outline: none;
`;
