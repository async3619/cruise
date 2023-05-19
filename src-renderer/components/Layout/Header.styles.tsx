import styled from "@emotion/styled";
import { backgroundColors } from "@styles/theme";

export const Root = styled.div`
    margin: 0;
    padding: ${({ theme }) => theme.spacing(1, 1.5)};

    -webkit-app-region: drag;

    ${({ theme }) => theme.getColorSchemeSelector("dark")} {
        color: white;
        background: ${backgroundColors["950"]};
    }

    ${({ theme }) => theme.getColorSchemeSelector("light")} {
        color: black;
        background: ${backgroundColors["100"]};
    }
`;

export const Title = styled.h1`
    ${({ theme }) => theme.getColorSchemeSelector("dark")} {
        color: rgba(255, 255, 255, 0.5);
    }

    ${({ theme }) => theme.getColorSchemeSelector("light")} {
        color: rgba(0, 0, 0, 0.75);
    }
`;
