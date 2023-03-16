import styled from "@emotion/styled";

export const Root = styled.div`
    margin: 0;
    padding: ${({ theme }) => theme.spacing(1, 2)};

    display: flex;
    align-items: center;

    background-color: #f9f9f9;
`;
