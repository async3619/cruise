import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { TITLE_BAR_HEIGHT } from "@constants/layout";

export const GlobalStyles = css`
    html {
        font-size: 14px;
    }

    html,
    body,
    #root {
        height: 100%;

        overflow-y: hidden;
    }

    @font-face {
        font-family: "SUIT Variable";
        font-weight: 100 900;
        src: url("./suit.woff2") format("woff2-variations");
    }

    * {
        user-select: none;
    }
`;

export const Root = styled.div`
    height: 100vh;
    max-height: 100vh;

    margin: 0;
    padding: 0;

    position: relative;

    background: #f9f9f9;
`;

export const Main = styled.main`
    min-width: 0;

    padding-top: ${TITLE_BAR_HEIGHT}px;

    flex: 1 1 auto;
`;

export const MainWrapper = styled.div`
    display: flex;

    position: absolute;
    top: 0;
    left: 0;
    right: 0;
`;
