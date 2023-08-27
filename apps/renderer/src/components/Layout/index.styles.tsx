import { backgroundColors } from "ui";

import styled from "@emotion/styled";
import { css } from "@emotion/react";

export const GlobalStyles = css`
    @import url("https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@300&display=swap");

    html,
    body,
    #app {
        height: 100vh;
    }

    @font-face {
        font-family: "SUIT Variable Webfont";
        font-weight: 100 900;
        src: url("/suit.woff2") format("woff2-variations");
    }

    * {
        user-select: none;
    }
`;

export const Root = styled.div`
    height: 100%;

    display: flex;
    flex-direction: column;
`;

export const Body = styled.div`
    display: flex;
    position: relative;

    flex: 1 1 auto;

    transition: ${({ theme }) =>
        theme.transitions.create(["background-color"], { duration: theme.transitions.duration.shortest })};

    ${({ theme }) => theme.getColorSchemeSelector("dark")} {
        background-color: ${backgroundColors["950"]};
    }

    ${({ theme }) => theme.getColorSchemeSelector("light")} {
        background-color: ${backgroundColors["100"]};
    }
`;

export const Main = styled.main`
    border-top-left-radius: ${({ theme }) => theme.shape.borderRadius}px;

    flex: 1 1 auto;

    position: relative;

    transition: ${({ theme }) =>
        theme.transitions.create(["background-color"], { duration: theme.transitions.duration.shortest })};

    ${({ theme }) => theme.getColorSchemeSelector("dark")} {
        background-color: ${backgroundColors["800"]};
    }

    ${({ theme }) => theme.getColorSchemeSelector("light")} {
        background-color: ${({ theme }) => theme.vars.palette.background.default};
    }
`;
