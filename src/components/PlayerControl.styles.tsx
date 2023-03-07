import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

export const ShuffleRotation = keyframes`
    0% {
        transform: rotateX(0deg);
    }
    
    100% {
        transform: rotateX(360deg);
    }
`;

export const Root = styled.div`
    margin: 0;
    padding: 0;

    display: flex;
    align-items: center;
`;

export const ButtonWrapper = styled.div<{ disabled?: boolean }>`
    margin-right: ${({ theme }) => theme.spacing(0.5)};

    svg {
        color: ${({ theme, disabled }) => (disabled ? theme.palette.text.disabled : "inherit")};
    }

    &:last-child {
        margin-right: 0;
    }
`;

export const PlayWrapper = styled(ButtonWrapper)`
    svg {
        font-size: 2.25rem;
    }
`;
