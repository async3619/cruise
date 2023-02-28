import styled from "@emotion/styled";
import { css } from "@emotion/react";

export const GlobalStyles = css`
    html,
    body,
    #root {
        height: 100%;
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

    background: #f9f9f9;
`;

export const Main = styled.main`
    display: flex;
    justify-content: center;
    align-items: center;
`;
