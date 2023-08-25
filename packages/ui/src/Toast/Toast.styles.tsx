import React from "react";

import { Alert, css } from "@mui/material";
import styled from "@emotion/styled";

import { backgroundColors } from "../theme";
import { ExtendComponentProps } from "../types";

export type RootProps = ExtendComponentProps<typeof Alert, { hasButton?: boolean }>;
export const Root = styled(({ hasButton: _, ...props }: RootProps) => <Alert {...props} />)<RootProps>`
    min-height: ${({ theme }) => theme.spacing(4.5)};

    margin: ${({ theme }) => theme.spacing(0, 0, 1)};
    padding: ${({ theme, hasButton }) => theme.spacing(0, hasButton ? 1 : 2, 0, 2)};
    border-radius: 4px;

    position: relative;
    overflow: hidden;

    box-shadow: ${({ theme }) => theme.shadows[8]};
    transition: ${({ theme }) => theme.transitions.create(["background-color"])};

    cursor: ${({ onClick }) => (onClick ? "pointer" : "default")};

    ${({ theme, severity }) =>
        severity
            ? ""
            : css`
                  color: ${theme.vars.palette.text.primary};

                  ${theme.getColorSchemeSelector("dark")} {
                      background-color: ${backgroundColors["950"]};
                  }

                  ${theme.getColorSchemeSelector("light")} {
                      background-color: ${backgroundColors["50"]};
                  }
              `}
    > .MuiAlert-message {
        padding: 0;

        display: flex;
        align-items: center;

        overflow: visible;
    }

    &:last-of-type {
        margin-bottom: 0;
    }
`;
