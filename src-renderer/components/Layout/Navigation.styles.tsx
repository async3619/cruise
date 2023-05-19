import styled from "@emotion/styled";
import { backgroundColors } from "@styles/theme";

export const Root = styled.div`
    min-width: 260px;

    padding: ${({ theme }) => theme.spacing(1, 2)};

    ${({ theme }) => theme.getColorSchemeSelector("dark")} {
        background: ${backgroundColors["950"]};
    }

    ${({ theme }) => theme.getColorSchemeSelector("light")} {
        background: ${backgroundColors["100"]};
    }
`;
