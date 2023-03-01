import styled from "@emotion/styled";

export const Root = styled.div`
    margin: 0;
    padding: 0;
`;

export const Item = styled.div`
    max-width: 100%;

    display: flex;
    align-items: center;

    &:not(:last-of-type) {
        margin-bottom: ${({ theme }) => theme.spacing(2)};
    }
`;

export const Label = styled.p`
    max-width: 100%;

    margin-right: ${({ theme }) => theme.spacing(2)} !important;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;
