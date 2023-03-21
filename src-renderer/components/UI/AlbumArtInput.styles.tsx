import styled from "@emotion/styled";

export const Root = styled.div`
    margin: 0;
    padding: 0;

    display: flex;
`;

export const AlbumArtWrapper = styled.div`
    max-width: ${({ theme }) => theme.spacing(25)};

    margin-right: ${({ theme }) => theme.spacing(2)};
`;

export const AlbumArtControl = styled.div`
    display: flex;
`;

export const Description = styled.div`
    display: flex;
    flex: 1 1 auto;
    justify-content: space-between;
    flex-direction: column;
`;

export const Pagination = styled.div`
    width: 100%;

    display: flex;
    align-items: center;
`;
