import styled from "@emotion/styled";

export const ScrollThumb = styled.div`
    z-index: 100;

    border-radius: 14px;
    background: ${({ theme }) => theme.vars.palette.action.active};

    opacity: 0.25;
    cursor: pointer;
`;
