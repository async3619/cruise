import styled from "@emotion/styled";
import { backgroundColors } from "../theme";

export const Root = styled.div<{ standalone: boolean }>`
    margin: 0;
    padding: ${({ theme, standalone }) => theme.spacing(standalone ? 0 : 0.75)};

    ${({ theme }) => theme.getColorSchemeSelector("dark")} {
        background-color: ${backgroundColors["950"]};
    }

    ${({ theme }) => theme.getColorSchemeSelector("light")} {
        background-color: ${backgroundColors["50"]};
    }
`;

export const Divider = styled.div`
    height: 1px;

    margin: ${({ theme }) => theme.spacing(0.75, 0)};

    background-color: ${({ theme }) => theme.palette.divider};
`;
