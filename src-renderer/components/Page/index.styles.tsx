import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

export const ContentAnimation = keyframes`
    from {
        opacity: 0;
        transform: translateY(16px);
    }

    to {
        opacity: 1;
        transform: translateY(0px);
    }
`;

export const Root = styled.div`
    margin: 0;
    padding: 0;
`;

export const Content = styled.div`
    padding: ${({ theme }) => theme.spacing(0, 2, 2)};

    animation: ${ContentAnimation} ${({ theme }) => theme.transitions.duration.standard}ms
        ${({ theme }) => theme.transitions.easing.easeInOut};
`;

export const Header = styled.header`
    padding: ${({ theme }) => theme.spacing(2)};

    position: sticky;
    top: 0;

    z-index: 100;

    background: ${({ theme }) => theme.vars.palette.background.default};
`;
