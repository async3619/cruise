import styled from "@emotion/styled";

export const Root = styled.div`
    margin: 0;
    padding: 0;
    border-top: 1px solid #e5e5e5;

    display: flex;
    flex-direction: column;

    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;

    z-index: 100;

    background: #f9f9f9;
`;

export const ProgressWrapper = styled.div`
    height: ${({ theme }) => theme.spacing(4)};

    display: flex;
    align-items: stretch;
`;

export const Progress = styled.div`
    height: ${({ theme }) => theme.spacing(0.5)};

    border-radius: 100px;

    flex: 1 1 auto;
    position: relative;

    background: #8a8a8a;
`;

export const Cursor = styled.div`
    width: ${({ theme }) => theme.spacing(2.75)};
    height: ${({ theme }) => theme.spacing(2.75)};

    border: 1px solid #e5e5e5;
    border-radius: 100%;

    position: absolute;
    top: 50%;
    left: 0;

    background: #fff;

    transform: translate(-50%, -50%);

    &:before {
        content: "";

        width: ${({ theme }) => theme.spacing(1.25)};
        height: ${({ theme }) => theme.spacing(1.25)};

        border-radius: 100%;

        position: absolute;
        top: 50%;
        left: 50%;

        background: ${({ theme }) => theme.palette.primary.main};

        transform: translate(-50%, -50%);
        transition: ${({ theme }) => theme.transitions.create("transform")};
    }

    &:hover {
        &:before {
            transform: translate(-50%, -50%) scale(1.35);
        }
    }

    &:active {
        &:before {
            transform: translate(-50%, -50%) scale(0.8);
        }
    }
`;

export const Filled = styled.div`
    height: 100%;

    border-radius: 100px;

    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    background: ${({ theme }) => theme.palette.primary.main};
    transform-origin: left center;
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
