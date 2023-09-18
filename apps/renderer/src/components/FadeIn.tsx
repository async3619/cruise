import styled from "@emotion/styled";
import { keyframes } from "@emotion/css";

export const FadeInKeyframes = keyframes`
    from {
        opacity: 0;
        transform: translateY(12px);
    }
    
    to {
        opacity: 1;
        transform: translateY(0);
    }
`;

export const FadeIn = styled.div`
    animation: ${FadeInKeyframes} ${({ theme }) => theme.transitions.duration.enteringScreen}ms ease-in-out;
`;
