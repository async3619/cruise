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

    > p {
        pointer-events: none;
    }
`;

export const Icon = styled.img`
    margin: ${({ theme }) => theme.spacing(0, 2, 0, 0)};

    width: ${({ theme }) => theme.spacing(2.5)};
    height: ${({ theme }) => theme.spacing(2.5)};

    display: block;
`;

export const BackButton = styled.button`
    height: ${({ theme }) => theme.spacing(4)};

    margin: ${({ theme }) => theme.spacing(0, 1, 0, 0)};
    padding: ${({ theme }) => theme.spacing(0.5, 1.5)};
    border: 0;
    border-radius: 4px;

    display: block;

    color: ${({ theme }) => theme.palette.text.primary};
    background: transparent;

    > svg {
        width: 16px;
        height: 16px;

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
        color: ${({ theme }) => theme.palette.text.disabled};
    }
`;
