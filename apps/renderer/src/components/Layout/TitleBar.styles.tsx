import { backgroundColors } from "ui";

import styled from "@emotion/styled";

export const Root = styled.div`
    margin: 0;
    padding: ${({ theme }) => theme.spacing(0, 0, 0, 1.5)};

    flex: 0 0 auto;

    display: flex;
    align-items: center;
    justify-content: space-between;

    -webkit-app-region: drag;

    transition: ${({ theme }) =>
        theme.transitions.create(["color", "background-color"], { duration: theme.transitions.duration.shortest })};

    ${({ theme }) => theme.getColorSchemeSelector("dark")} {
        color: ${({ theme }) => theme.vars.palette.text.disabled};
        background-color: ${backgroundColors["950"]};
    }

    ${({ theme }) => theme.getColorSchemeSelector("light")} {
        color: ${({ theme }) => theme.vars.palette.text.secondary};
        background-color: ${backgroundColors["100"]};
    }
`;
