import { animated } from "react-spring";

import styled from "@emotion/styled";
import { TITLE_BAR_HEIGHT } from "@constants/layout";

export const Root = styled.div`
    width: 100%;
    max-width: 360px;

    padding: ${({ theme }) => theme.spacing(0, 2, 2)};

    position: absolute;
    right: 0;
    top: ${TITLE_BAR_HEIGHT}px;

    z-index: 3000;
`;

export const Item = styled(animated.div)``;

export const Content = styled.div`
    padding-bottom: ${({ theme }) => theme.spacing(1)};
`;
