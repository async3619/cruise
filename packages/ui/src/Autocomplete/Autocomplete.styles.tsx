import styled from "@emotion/styled";
import { backgroundColors } from "../theme";

export const Root = styled.div<{ fullWidth: boolean }>`
    margin: 0;
    padding: 0;

    position: relative;
    display: ${({ fullWidth }) => (fullWidth ? "block" : "inline-block")};
`;

export const List = styled.ul`
    max-height: ${({ theme }) => theme.spacing(40)};

    margin: ${({ theme }) => theme.spacing(1, 0)};
    padding: ${({ theme }) => theme.spacing(0.5)};
    border-radius: ${({ theme }) => theme.shape.borderRadius}px;

    overflow-y: auto;

    ${({ theme }) => theme.getColorSchemeSelector("dark")} {
        background-color: ${backgroundColors["950"]};
    }

    ${({ theme }) => theme.getColorSchemeSelector("light")} {
        background-color: ${backgroundColors["50"]};
    }
`;

export const Option = styled.li`
    margin: 0;
    padding: ${({ theme }) => theme.spacing(1)};
    border-radius: ${({ theme }) => theme.shape.borderRadius}px;

    list-style: none;

    display: flex;
    align-items: center;

    font-size: ${({ theme }) => theme.typography.body2.fontSize};
    color: ${({ theme }) => theme.palette.text.secondary};

    &:hover,
    &.Mui-focused,
    &.Mui-focusVisible {
        color: ${({ theme }) => theme.palette.text.primary};
        background-color: ${({ theme }) => theme.palette.action.hover};
    }
`;

export const Icon = styled.div`
    margin-right: ${({ theme }) => theme.spacing(1)};

    display: flex;
    align-items: center;
    justify-content: center;
`;
