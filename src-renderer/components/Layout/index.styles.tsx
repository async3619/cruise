import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { backgroundColors } from "@styles/theme";

export const GlobalStyles = css`
    @font-face {
        font-family: "SUIT Variable";
        font-weight: 100 900;
        src: local("SUIT Variable Regular"), url("/suit.woff2") format("woff2-variations");
    }
`;

export const Root = styled.div`
    height: 100vh;

    margin: 0;
    padding: 0;

    display: flex;
    flex-direction: column;

    ${({ theme }) => theme.getColorSchemeSelector("dark")} {
        background: ${backgroundColors["950"]};
    }

    ${({ theme }) => theme.getColorSchemeSelector("light")} {
        background: ${backgroundColors["100"]};
    }
`;

export const Content = styled.main`
    padding: ${({ theme }) => theme.spacing(2)};

    flex: 1 1 auto;

    color: ${({ theme }) => theme.vars.palette.text.primary};
    background: ${({ theme }) => theme.vars.palette.background.default};
`;

export const Body = styled.div`
    display: flex;
    flex: 1 1 auto;
`;
