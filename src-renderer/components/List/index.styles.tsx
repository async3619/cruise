import styled from "@emotion/styled";

export const Root = styled.div`
    height: 100%;

    margin: 0;
    padding: 0;

    display: flex;
    flex-direction: column;
`;

export const Separator = styled.div`
    height: 1px;

    margin: ${({ theme }) => theme.spacing(0, 0, 1)};

    background: #e5e5e5;
`;

export const Gap = styled.div`
    flex: 1 1 auto;
`;
