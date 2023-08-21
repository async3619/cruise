import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { backgroundColors } from "@styles/theme.ts";

export const GlobalStyles = css`
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

    flex: 1 1 auto;

    background-color: ${backgroundColors["950"]};
`;

export const Main = styled.main`
    border-top-left-radius: ${({ theme }) => theme.shape.borderRadius}px;

    flex: 1 1 auto;

    position: relative;

    background-color: ${({ theme }) => theme.palette.background.default};
`;
