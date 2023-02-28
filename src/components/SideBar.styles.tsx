import styled from "@emotion/styled";

export const Root = styled.div`
    width: 330px;

    margin: 0;
    padding: ${({ theme }) => theme.spacing(6, 0, 0, 0)};
    border-right: 1px solid ${({ theme }) => theme.palette.divider};

    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;

    background: #f3f3f3;
`;
