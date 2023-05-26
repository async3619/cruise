import styled from "@emotion/styled";

export const Root = styled.div`
    margin: 0;
    padding: 0;
    border-radius: 4px;

    aspect-ratio: 1 / 1;

    background: rgba(0, 0, 0, 0.15);

    overflow: hidden;
`;

export const Image = styled.div`
    width: 100%;
    height: 100%;

    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
`;
