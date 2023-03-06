import styled from "@emotion/styled";

export const Root = styled.button`
    width: ${({ theme }) => theme.spacing(3.25)};
    height: ${({ theme }) => theme.spacing(3.25)};

    margin: 0;
    padding: 0;
    border: 0;
    border-radius: 4px;

    display: flex;
    align-items: center;
    justify-content: center;

    box-sizing: border-box;

    background: transparent;

    > svg {
        display: block;
        color: ${({ theme }) => theme.palette.primary.main};
    }

    &:not(:disabled) {
        &:hover {
            background: rgba(0, 0, 0, 0.1);
        }

        &:active {
            background: rgba(0, 0, 0, 0.05);
        }
    }
`;
