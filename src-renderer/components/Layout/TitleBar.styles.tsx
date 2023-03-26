import styled from "@emotion/styled";

import { TITLE_BAR_HEIGHT } from "@constants/layout";

export const Root = styled.div`
    height: ${TITLE_BAR_HEIGHT}px;

    margin: 0;
    padding: ${({ theme }) => theme.spacing(0, 0, 0, 1)};

    display: flex;
    align-items: center;

    position: fixed;
    top: 0;
    left: 0;
    right: 0;

    z-index: 10;

    user-select: none;
    -webkit-app-region: drag;

    > p {
        pointer-events: none;
        -webkit-app-region: drag;
    }

    > * {
        -webkit-app-region: none;
    }
`;

export const Icon = styled.img`
    margin: ${({ theme }) => theme.spacing(0, 2, 0, 2)};

    width: ${({ theme }) => theme.spacing(2.5)};
    height: ${({ theme }) => theme.spacing(2.5)};

    display: block;

    -webkit-app-region: drag;
`;

export const BackButton = styled.button`
    height: ${({ theme }) => theme.spacing(4)};

    margin: ${({ theme }) => theme.spacing(0, 0.5, 0, 0)};
    padding: ${({ theme }) => theme.spacing(0.5, 1.5)};
    border: 0;
    border-radius: 4px;

    display: block;

    color: rgba(0, 0, 0, 0.35);
    background: transparent;

    > svg {
        display: block;
    }

    &:not(:disabled) {
        &:hover {
            background: ${({ theme }) => theme.palette.action.hover};
        }

        &:active {
            background: ${({ theme }) => theme.palette.action.selected};
        }
    }

    &:disabled {
        color: rgba(0, 0, 0, 0.15);
    }
`;
