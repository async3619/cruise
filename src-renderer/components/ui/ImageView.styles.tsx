import styled from "@emotion/styled";

export const CircularRoot = styled.div`
    margin: 0;
    padding: 0;
    border-radius: 50%;

    aspect-ratio: 1 / 1;

    display: flex;
    justify-content: center;
    align-items: center;

    background-color: rgba(0, 0, 0, 0.15);
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;

    svg {
        width: 35%;
        height: 35%;

        opacity: 0.5;
    }
`;

export const SquareRoot = styled.div`
    margin: 0;
    padding: 0;
    border-radius: 4px;

    aspect-ratio: 1 / 1;

    display: flex;
    justify-content: center;
    align-items: center;

    background-color: rgba(0, 0, 0, 0.15);
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;

    svg {
        width: 35%;
        height: 35%;

        opacity: 0.5;
    }
`;
