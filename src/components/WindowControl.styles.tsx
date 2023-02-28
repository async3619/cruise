import styled from "@emotion/styled";

export const Root = styled.div`
    margin: 0;
    padding: 0;

    display: flex;

    position: absolute;
    top: 0;
    right: 0;
`;

export const Button = styled.button<{ close?: boolean }>`
    height: ${({ theme }) => theme.spacing(4)};

    margin: 0;
    padding: ${({ theme }) => theme.spacing(0, 2.25)};
    border: 0;

    display: flex;
    align-items: center;

    background: transparent;

    &:hover {
        color: ${({ theme, close }) => (close ? "white" : theme.palette.text.primary)};
        background: ${({ close }) => (close ? "#c42b1c" : "#e9e9e9")};

        > svg {
            color: ${({ close }) => (close ? "white" : "black")};
        }
    }

    > svg {
        width: 14px;
        height: 14px;

        display: block;

        color: ${({ theme }) => theme.palette.text.primary};
    }
`;

export const MinimizeIcon = styled.span`
    width: 10px;
    height: 1px;

    display: block;

    background: ${({ theme }) => theme.palette.text.primary};
`;

export const MaximizeIcon = styled.span`
    width: 10px;
    height: 10px;

    border: 1px solid ${({ theme }) => theme.palette.text.primary};
    border-radius: 2px;

    display: block;
`;
