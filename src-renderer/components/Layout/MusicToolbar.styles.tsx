import styled from "@emotion/styled";
import { backgroundColors } from "@styles/theme";

export const Root = styled.div`
    margin: ${({ theme }) => theme.spacing(0, 0, 1)};
    padding: ${({ theme }) => theme.spacing(1, 2)};
    border-radius: 4px;

    display: flex;
    align-items: center;

    position: static;
    top: 0;

    opacity: 0;
    pointer-events: none;

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

export const ChildrenWrapper = styled.div`
    height: 0;
`;

export const Children = styled(Root)`
    opacity: 1;
    pointer-events: auto;

    margin: 0;

    background-color: transparent !important;
`;
