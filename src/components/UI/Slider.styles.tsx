import styled from "@emotion/styled";

export const Root = styled.div`
    height: ${({ theme }) => theme.spacing(2.75)};

    margin: 0;
    padding: 0;
`;

export const Bar = styled.div`
    height: ${({ theme }) => theme.spacing(0.5)};
    border-radius: ${({ theme }) => theme.spacing(0.25)};
`;
