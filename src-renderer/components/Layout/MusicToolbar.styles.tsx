import styled from "@emotion/styled";
import { backgroundColors } from "@styles/theme";

export const Root = styled.div`
    margin: ${({ theme }) => theme.spacing(0, 0, 1)};
    padding: ${({ theme }) => theme.spacing(1, 2)};
    border-radius: 4px;

    display: flex;
    align-items: center;

    position: sticky;
    top: 0;

    opacity: 0;

    transition: ${spacing =>
        spacing.theme.transitions.create(["opacity"], {
            duration: spacing.theme.transitions.duration.shortest,
        })};

    ${({ theme }) => theme.getColorSchemeSelector("dark")} {
        background-color: ${backgroundColors["900"]};
    }

    ${({ theme }) => theme.getColorSchemeSelector("light")} {
        background-color: ${backgroundColors["50"]};
    }
`;
