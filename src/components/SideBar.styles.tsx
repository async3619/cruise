import styled from "@emotion/styled";

import { SIDEBAR_WIDTH, TITLE_BAR_HEIGHT } from "@constants/layout";

export const Root = styled.div`
    width: ${SIDEBAR_WIDTH}px;

    margin: 0;
    padding-top: ${TITLE_BAR_HEIGHT}px;
    border-right: 1px solid #e5e5e5;

    background: #f3f3f3;
`;
