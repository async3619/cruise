import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

const PageAnimation = keyframes`
    0% {
        opacity: 0;
    }
    
    100% {
        opacity: 1;
    }
`;

const MainAnimation = keyframes`
    0% {
        opacity: 0;
        transform: translateY(24px);
    }
    
    100% {
        opacity: 1;
        transform: translateY(0);
    }
`;

export const Root = styled.div`
    margin: 0;
    padding: 0;

    animation: ${PageAnimation} 0.25s ${({ theme }) => theme.transitions.easing.easeInOut} forwards;
`;

export const Header = styled.header``;

export const Main = styled.main`
    animation: ${MainAnimation} 0.35s ${({ theme }) => theme.transitions.easing.easeInOut} forwards;
`;
