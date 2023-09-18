import { backgroundColors } from "ui";

import styled from "@emotion/styled";
import { FadeInKeyframes } from "@components/FadeIn";

export const Root = styled.div`
    margin: 0;
    padding: 0;
`;

export const Header = styled.div<{ hasToolbar: boolean }>`
    padding: ${({ theme, hasToolbar }) => theme.spacing(2, 2, hasToolbar ? 1 : 2)};

    position: sticky;
    top: 0;

    z-index: 100;

    transition: ${({ theme }) =>
        theme.transitions.create(["background-color"], { duration: theme.transitions.duration.shortest })};

    ${({ theme }) => theme.getColorSchemeSelector("dark")} {
        background-color: ${backgroundColors["800"]};
    }

    ${({ theme }) => theme.getColorSchemeSelector("light")} {
        background-color: ${({ theme }) => theme.vars.palette.background.default};
    }
`;

export const Content = styled.div`
    padding: ${({ theme }) => theme.spacing(0, 2, 2)};

    animation: ${FadeInKeyframes} ${({ theme }) => theme.transitions.duration.enteringScreen}ms ease-in-out;
`;

export const ToolbarPlaceholder = styled.div`
    height: ${({ theme }) => theme.spacing(7)};

    margin-bottom: ${({ theme }) => theme.spacing(1)};

    display: block;
`;

export const FixedHelper = styled.div`
    height: 0;

    position: sticky;
    top: 0;

    z-index: 100;
`;
