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
    width: 100%;
    max-width: 100%;

    height: 100%;
    max-height: 100vh;

    margin: 0;
    padding: 0;

    box-sizing: border-box;

    display: flex;
    flex-direction: column;

    position: relative;

    animation: ${PageAnimation} 0.25s ${({ theme }) => theme.transitions.easing.easeInOut} forwards;
`;

export const Header = styled.header`
    margin: ${({ theme }) => theme.spacing(0)};
    padding: ${({ theme }) => theme.spacing(0, 7)};

    flex: 0 0 auto;

    ${({ theme }) => theme.breakpoints.down("md")} {
        padding: ${({ theme }) => theme.spacing(0, 2)};
    }
`;

export const FloatingHeader = styled(Header)`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
`;

export const Main = styled.main`
    padding: ${({ theme }) => theme.spacing(0, 7)};

    flex: 1 1 auto;

    overflow-y: auto;

    animation: ${MainAnimation} 0.35s ${({ theme }) => theme.transitions.easing.easeInOut} forwards;

    ${({ theme }) => theme.breakpoints.down("md")} {
        padding: ${({ theme }) => theme.spacing(0, 2)};
    }
`;
