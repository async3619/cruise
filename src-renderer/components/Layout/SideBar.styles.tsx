import styled from "@emotion/styled";

import { SIDEBAR_WIDTH, TITLE_BAR_HEIGHT } from "@constants/layout";

export const Root = styled.div<{ isShrink: boolean; isHidden: boolean; isOpen: boolean }>`
    width: ${({ isShrink, isOpen }) => (isShrink && !isOpen ? "auto" : `${SIDEBAR_WIDTH}px`)};

    margin: 0;
    padding-top: ${TITLE_BAR_HEIGHT}px;
    padding-bottom: ${({ theme }) => theme.spacing(1)};
    border-right: 1px solid #e5e5e5;

    position: ${({ isShrink, isOpen, isHidden }) => ((isShrink && isOpen) || isHidden ? "absolute" : "static")};
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 9;

    background: #f3f3f3;

    transform: ${({ isOpen, isHidden }) => (isHidden && !isOpen ? "translateX(-100%)" : "translateX(0)")};
    transition: ${({ theme, isHidden }) =>
        isHidden ? theme.transitions.create(["transform"], { duration: 200 }) : "none"};
`;

export const Wrapper = styled.div`
    display: flex;
    align-items: stretch;
`;

export const Backdrop = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 8;
`;

export const SearchWrapper = styled.div`
    padding: ${({ theme }) => theme.spacing(0, 2, 2)};
`;
