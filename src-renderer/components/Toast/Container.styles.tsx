import { animated } from "react-spring";

import styled from "@emotion/styled";

export const Root = styled.div`
    margin: 0;
    padding: ${({ theme }) => theme.spacing(0, 2, 2)};

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;

    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    overflow: hidden;
    z-index: 10000;

    pointer-events: none;
`;

export const Item = styled(animated.div)`
    pointer-events: auto;
`;

export const Content = styled.div`
    padding-top: ${({ theme }) => theme.spacing(1)};
`;
