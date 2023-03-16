import styled from "@emotion/styled";

export const Root = styled.div`
    margin: 0;
    padding: 0;
    border-top: 1px solid #e5e5e5;

    display: flex;
    flex-direction: column;

    z-index: 100;

    background: #f9f9f9;
`;

export const ProgressWrapper = styled.div`
    height: ${({ theme }) => theme.spacing(4)};

    display: flex;
    align-items: center;
`;

export const PlayTime = styled.div`
    width: 70px;

    display: flex;
    justify-content: stretch;
    align-items: center;

    flex: 0 0 70px;

    > p {
        flex: 1 1 auto;
    }

    &:first-of-type {
        margin-left: ${({ theme }) => theme.spacing(1.5)};
    }

    &:last-of-type {
        text-align: right;
        margin-right: ${({ theme }) => theme.spacing(1.5)};
    }
`;

export const Content = styled.div`
    padding: ${({ theme }) => theme.spacing(0, 1, 1)};

    display: flex;
`;
