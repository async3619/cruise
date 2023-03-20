import styled from "@emotion/styled";

export const Root = styled.div<{ empty: boolean }>`
    margin: 0;
    padding: 0;
    border: 1px solid ${({ theme }) => theme.palette.divider};
    border-radius: 4px;

    display: flex;
    justify-content: center;
    align-items: center;

    flex: 0 0 auto;
    aspect-ratio: 1 / 1;

    position: relative;

    overflow: hidden;

    background: ${({ theme, empty }) => (empty ? "#eeeeee" : theme.palette.background.default)};

    > svg {
        width: 30%;
        height: 30%;

        display: block;

        opacity: 0.5;
    }
`;

export const CircledRoot = styled(Root)`
    border-radius: 100%;
`;

export const Image = styled.img`
    width: 100%;
`;
