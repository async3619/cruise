import styled from "@emotion/styled";

export const Button = styled.button`
    width: 100%;

    margin: 0 0 ${({ theme }) => theme.spacing(1)};
    padding: ${({ theme }) => theme.spacing(1, 1.5)};
    border: 0;
    border-radius: 4px;

    display: flex;
    align-items: center;
    text-align: left;

    color: ${({ theme }) => theme.palette.text.primary};
    background: transparent;

    &:hover {
        background: #eaeaea;
    }

    &:active {
        color: ${({ theme }) => theme.palette.text.secondary};
        background: #ededed;
    }

    > svg {
        margin-right: ${({ theme }) => theme.spacing(2)};

        display: block;
    }
`;

export const Root = styled.div`
    margin: 0;
    padding: ${({ theme }) => theme.spacing(0, 1)};
`;
