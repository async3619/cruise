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
    height: 100%;
    max-height: 100vh;

    margin: 0;
    padding: 0;

    box-sizing: border-box;

    display: flex;
    flex-direction: column;

    animation: ${PageAnimation} 0.25s ${({ theme }) => theme.transitions.easing.easeInOut} forwards;
`;

export const Header = styled.header`
    margin: ${({ theme }) => theme.spacing(0)};
    padding: ${({ theme }) => theme.spacing(0, 7)};

    flex: 0 0 auto;
`;

export const Main = styled.main`
    padding: ${({ theme }) => theme.spacing(0, 7)};

    flex: 1 1 auto;

    overflow-y: auto;

    animation: ${MainAnimation} 0.35s ${({ theme }) => theme.transitions.easing.easeInOut} forwards;
`;
