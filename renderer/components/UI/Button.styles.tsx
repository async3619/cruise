import styled from "@emotion/styled";

export const Root = styled.button`
    height: ${({ theme }) => theme.spacing(4)};

    margin: 0;
    padding: ${({ theme }) => theme.spacing(0, 1.5)};
    border: 1px solid #efeeee;
    border-bottom-color: #d4d4d4;
    border-radius: 4px;

    display: flex;
    align-items: center;

    background: white;

    &:hover {
        background: #fbfbfb;
    }

    &:active {
        border-bottom-color: #efeeee;

        color: ${({ theme }) => theme.palette.text.secondary};
        background: #fcfcfc;
    }

    > svg {
        margin-right: ${({ theme }) => theme.spacing(1)};

        display: block;
    }
`;
