import styled from "@emotion/styled";
import { backgroundColors } from "@styles/theme";

export const Root = styled.div`
    height: 100%;
    min-width: 260px;

    ${({ theme }) => theme.getColorSchemeSelector("dark")} {
        background: ${backgroundColors["950"]};
    }

    ${({ theme }) => theme.getColorSchemeSelector("light")} {
        background: ${backgroundColors["100"]};
    }
`;

export const Content = styled.div`
    padding: ${({ theme }) => theme.spacing(1, 2)};
`;
