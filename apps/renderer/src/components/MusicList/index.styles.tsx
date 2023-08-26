import styled from "@emotion/styled";
import { backgroundColors } from "ui";
import { css } from "@emotion/react";

export const Root = styled.div`
    margin: 0;
    padding: 0;
`;

export const Item = styled.div<{ odd: boolean }>`
    margin: 0;
    padding: ${({ theme }) => theme.spacing(0, 2)};
    border-radius: ${({ theme }) => theme.shape.borderRadius}px;

    display: flex;

    ${({ odd, theme }) => {
        if (odd) {
            return "";
        }

        return css`
            ${theme.getColorSchemeSelector("dark")} {
                background-color: ${backgroundColors["900"]};
            }

            ${theme.getColorSchemeSelector("light")} {
                background-color: ${backgroundColors["50"]};
            }
        `;
    }}

    &:hover {
        ${({ theme }) => theme.getColorSchemeSelector("dark")} {
            background-color: ${backgroundColors["900"]};
        }

        ${({ theme }) => theme.getColorSchemeSelector("light")} {
            background-color: ${backgroundColors["100"]};
        }
    }
`;

export const Column = styled.div<{ width: string }>`
    width: ${({ width }) => width};

    min-width: 0;
    height: ${({ theme }) => theme.spacing(6)};

    display: flex;
    align-items: center;
    flex: 1 1 ${({ width }) => width};

    &:not(:last-of-type) {
        margin-right: ${({ theme }) => theme.spacing(2)};
    }
`;

export const Label = styled.p`
    width: 100%;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;
