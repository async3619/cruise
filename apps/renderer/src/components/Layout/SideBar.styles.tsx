import { backgroundColors } from "ui";

import styled from "@emotion/styled";

const SIDEBAR_WIDTH = 280;

export const Root = styled.nav`
    width: ${SIDEBAR_WIDTH}px;

    margin: 0;

    position: relative;

    transition: ${({ theme }) =>
        theme.transitions.create(["background-color"], { duration: theme.transitions.duration.shortest })};

    ${({ theme }) => theme.getColorSchemeSelector("dark")} {
        background-color: ${backgroundColors["950"]};
    }

    ${({ theme }) => theme.getColorSchemeSelector("light")} {
        background-color: ${backgroundColors["100"]};
    }
`;

export const Content = styled.div`
    padding: ${({ theme }) => theme.spacing(1.5, 1.5)};
`;
