import styled from "@emotion/styled";

export const Root = styled.div``;

export const Header = styled.div`
    padding: ${({ theme }) => theme.spacing(2)};
    border-bottom: 1px solid ${({ theme }) => theme.palette.divider};
`;

export const Body = styled.div`
    padding: ${({ theme }) => theme.spacing(2)};
`;

export const Footer = styled.div`
    padding: ${({ theme }) => theme.spacing(1)};
    border-top: 1px solid ${({ theme }) => theme.palette.divider};

    display: flex;
    justify-content: flex-end;
`;
