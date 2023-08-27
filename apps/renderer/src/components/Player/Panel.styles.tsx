import { backgroundColors } from "ui";

import styled from "@emotion/styled";

export const Root = styled.div`
    height: ${({ theme }) => theme.spacing(11)};

    margin: 0;
    padding: ${({ theme }) => theme.spacing(0, 2)};
    border-top: 1px solid ${({ theme }) => theme.vars.palette.divider};

    display: flex;
    justify-content: center;
    align-items: center;

    transition: ${({ theme }) =>
        theme.transitions.create("background-color", {
            duration: theme.transitions.duration.shortest,
        })};

    ${({ theme }) => theme.getColorSchemeSelector("dark")} {
        background: ${backgroundColors["950"]};
    }

    ${({ theme }) => theme.getColorSchemeSelector("light")} {
        background: ${backgroundColors["100"]};
    }
`;
