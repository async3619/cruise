import styled from "@emotion/styled";
import { backgroundColors } from "@styles/theme";

const SIDEBAR_WIDTH = 280;

export const Root = styled.nav`
    width: ${SIDEBAR_WIDTH}px;

    margin: 0;

    position: relative;

    background-color: ${backgroundColors["950"]};
`;

export const Content = styled.div`
    padding: ${({ theme }) => theme.spacing(1.5, 1.5)};
`;
