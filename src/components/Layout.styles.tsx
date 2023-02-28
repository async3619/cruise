import styled from "@emotion/styled";
import { css } from "@emotion/react";

export const GlobalStyles = css`
    html,
    body,
    #root {
        height: 100%;
    }
`;

export const Root = styled.div`
    height: 100%;

    margin: 0;
    padding: 0;
`;

export const Main = styled.main`
    height: 100%;

    display: flex;
    justify-content: center;
    align-items: center;
`;
