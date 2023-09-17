import styled from "@emotion/styled";
import { backgroundColors } from "../theme";

export const Root = styled.div<{ standalone: boolean }>`
    margin: 0;
    padding: ${({ theme, standalone }) => theme.spacing(standalone ? 0 : 0.75)};

    transition: ${({ theme }) =>
        theme.transitions.create(["background-color"], {
            duration: theme.transitions.duration.shortest,
        })};

    ${({ theme }) => theme.getColorSchemeSelector("dark")} {
        background-color: ${backgroundColors["950"]};
    }

    ${({ theme }) => theme.getColorSchemeSelector("light")} {
        background-color: ${({ standalone }) => (standalone ? backgroundColors["100"] : backgroundColors["50"])};
    }
`;

export const Divider = styled.div`
    height: 1px;

    margin: ${({ theme }) => theme.spacing(0.75, 0)};

    background-color: ${({ theme }) => theme.palette.divider};
`;
