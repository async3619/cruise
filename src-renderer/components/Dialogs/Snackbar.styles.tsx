import { Paper } from "@mui/material";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

export const Root = styled(Paper)`
    padding: ${({ theme }) => theme.spacing(0.75, 2)};

    font-size: 1rem;

    display: flex;
    align-items: center;

    position: relative;
    overflow: hidden;

    cursor: pointer;

    transition: ${({ theme }) => theme.transitions.create(["background-color", "color"])};
`;

export const Icon = styled.div`
    padding: ${({ theme }) => theme.spacing(1, 0)};
    margin-right: ${({ theme }) => theme.spacing(1.5)};

    display: block;

    > svg {
        width: 22px;
        height: 22px;

        display: block;
    }

    > span {
        display: block;
    }
`;

export const Progress = keyframes`
    0% {
        transform: scaleX(0);
    }
    
    100% {
        transform: scaleX(1);
    }
`;

export const ProgressBar = styled.div`
    height: ${({ theme }) => theme.spacing(0.5)};

    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;

    transform-origin: left;
    transform: scaleX(0);

    animation-name: ${Progress};
    animation-timing-function: linear;
    animation-fill-mode: forwards;
`;
