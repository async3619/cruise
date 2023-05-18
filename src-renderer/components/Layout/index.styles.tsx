import styled from "@emotion/styled";
import { css } from "@emotion/react";

export const GlobalStyles = css`
    @font-face {
        font-family: "SUIT Variable";
        font-weight: 100 900;
        src: local("SUIT Variable Regular"), url("/suit.woff2") format("woff2-variations");
    }
`;

export const Root = styled.div`
    margin: 0;
    padding: 0;
`;

export const Content = styled.main`
    margin: 0;
    padding: ${({ theme }) => theme.spacing(1.5)};

    color: ${({ theme }) => theme.vars.palette.text.primary};
    background: ${({ theme }) => theme.vars.palette.background.default};
`;
