import styled from "@emotion/styled";
import { keyframes } from "@emotion/css";

export const FadeIn = keyframes`
    from {
        opacity: 0;
        transform: translateY(12px);
    }
    
    to {
        opacity: 1;
        transform: translateY(0);
    }
`;

export const Root = styled.div`
    margin: 0;
    padding: 0;
`;

export const Header = styled.div`
    padding: ${({ theme }) => theme.spacing(2, 2, 0)};
`;

export const Content = styled.div`
    padding: ${({ theme }) => theme.spacing(2)};

    animation: ${FadeIn} ${({ theme }) => theme.transitions.duration.enteringScreen}ms ease-in-out;
`;
