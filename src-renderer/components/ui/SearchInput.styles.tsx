import styled from "@emotion/styled";

import { backgroundColors } from "@styles/theme";

export const Root = styled.label<{ fullWidth?: boolean }>`
    width: ${({ fullWidth }) => (fullWidth ? "100%" : "auto")};

    margin: 0;
    padding: ${({ theme }) => theme.spacing(0.5, 2)};
    border-radius: calc(1.4375em + 9px);

    display: block;

    ${({ theme }) => theme.getColorSchemeSelector("dark")} {
        background-color: ${backgroundColors["950"]};
    }

    ${({ theme }) => theme.getColorSchemeSelector("light")} {
        background-color: ${backgroundColors["100"]};
    }

    &:focus-within {
        box-shadow: 0 0 0 3px ${({ theme }) => `rgba(${theme.vars.palette.primary.lightChannel} / 0.5)`};
    }
`;
