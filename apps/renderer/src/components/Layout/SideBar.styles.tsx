import styled from "@emotion/styled";
import { backgroundColors } from "@styles/theme";

const SIDEBAR_WIDTH = 280;

export const Root = styled.nav`
    width: ${SIDEBAR_WIDTH}px;

    margin: 0;
    padding: ${({ theme }) => theme.spacing(0.5, 1.5)};

    background-color: ${backgroundColors["950"]};
`;
