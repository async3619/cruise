import styled from "@emotion/styled";

import { TITLE_BAR_HEIGHT } from "@constants/layout";

export const Root = styled.div`
    height: ${TITLE_BAR_HEIGHT}px;

    margin: 0;
    padding: ${({ theme }) => theme.spacing(0, 2)};

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
