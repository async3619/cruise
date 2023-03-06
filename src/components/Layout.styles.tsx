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

    * {
        user-select: none;
    }

    @font-face {
        font-family: "SUIT Variable";
        font-weight: 100 900;
        src: url("/suit.woff2") format("woff2-variations");
    }
`;

export const Root = styled.div`
    height: 100%;

    margin: 0;
    padding: 0;

    display: flex;
    flex-direction: column;

    background: #f9f9f9;
`;

export const Main = styled.main`
    height: 100vh;

    padding-top: ${TITLE_BAR_HEIGHT}px;

    flex: 1 1 auto;
`;
