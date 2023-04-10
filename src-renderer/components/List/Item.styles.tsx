import styled from "@emotion/styled";

export const Button = styled.button<{ active: boolean }>`
    width: 100%;

    margin: 0 0 ${({ theme }) => theme.spacing(1)};
    padding: ${({ theme }) => theme.spacing(1, 1.5)};
    border: 0;
    border-radius: 4px;

    position: relative;
    display: flex;
    align-items: center;
    text-align: left;

    color: ${({ theme }) => theme.palette.text.primary};
    background: ${({ active }) => (active ? "#eaeaea" : "transparent")};

    &:hover,
    .Mui-focusVisible & {
        background: rgba(0, 0, 0, 0.025);
    }

    &:active {
        color: ${({ theme }) => theme.palette.text.secondary};
        background: #ededed;
    }

    > svg {
        display: block;

        color: rgba(0, 0, 0, 0.35);
    }

    > p:not(:first-child) {
        margin-left: ${({ theme }) => theme.spacing(2)};
    }

    &:before {
        content: "";

        width: 3px;
        height: 50%;

        border-radius: 32px;

        position: absolute;
        top: 50%;
        left: 0;

        background: ${({ theme }) => theme.palette.primary.main};
        transform: translateY(-50%);

        opacity: ${({ active }) => (active ? 1 : 0)};
        transition: ${({ theme }) => theme.transitions.create("opacity", { duration: 100 })};
    }
`;

export const Root = styled.div<{ withoutPadding?: boolean }>`
    margin: 0;
    padding: ${({ theme, withoutPadding }) => theme.spacing(0, withoutPadding ? 0 : 1)};

    &:last-child {
        ${Button} {
            margin-bottom: 0;
        }
    }
`;
