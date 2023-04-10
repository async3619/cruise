import styled from "@emotion/styled";
import { Button, ButtonProps } from "@mui/material";

import { getBackColor, getTextColor } from "@utils/styles";

export const Root = styled(Button)`
    text-transform: none;

    height: ${({ theme }) => theme.spacing(4)};

    padding: ${({ theme }) => theme.spacing(0, 1.5)};
    border: 1px solid ${({ theme, color }) => getBackColor(theme, color, { darken: 0.06 }, { darken: 0.06 })};
    border-bottom-color: ${({ theme, color }) => getBackColor(theme, color, { darken: 0.16 }, { darken: 0.06 })};

    color: ${({ theme, color }) => getTextColor(theme, color)};
    background: ${({ theme, color }) => getBackColor(theme, color)};

    &:hover {
        color: ${({ theme, color }) => getTextColor(theme, color)};
        background: ${({ theme, color }) => getBackColor(theme, color, { darken: 0.02 }, { lighten: 0.03 })};
    }

    &:active {
        border-color: ${({ theme, color }) => getBackColor(theme, color, { darken: 0.06 }, { lighten: 0.2 })};

        color: ${({ theme, color }) => getTextColor(theme, color)};
        background: ${({ theme, color }) => getBackColor(theme, color, { darken: 0.03 }, { lighten: 0.2 })};
    }

    &:disabled {
        border-color: ${({ theme }) => theme.palette.action.disabledBackground};
        background: ${({ theme }) => theme.palette.action.disabledBackground};

        color: ${({ theme }) => theme.palette.action.disabled};
    }

    > svg {
        width: ${({ theme }) => theme.spacing(2)};
        height: ${({ theme }) => theme.spacing(2)};

        margin-right: ${({ theme }) => theme.spacing(1)};

        display: block;
    }
`;

export const OptionButton = styled(Root)`
    min-width: auto;

    padding: ${({ theme }) => theme.spacing(0, 0.5)};

    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    border-left: 0;

    > svg {
        width: ${({ theme }) => theme.spacing(3)};
        height: ${({ theme }) => theme.spacing(3)};

        margin: 0;

        display: block;
    }
`;

export const Wrapper = styled.div<{ color?: ButtonProps["color"] }>`
    display: flex;
    position: relative;

    > ${Root} {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;

        border-right-color: ${({ theme, color }) => getBackColor(theme, color, { darken: 0.16 }, { darken: 0.06 })};
    }
`;

export const OptionWrapper = styled.div`
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;

    background: #f9f9f9;
    box-shadow: 0 12px 6px -3px rgb(0 0 0 / 5%), 0px 20px 14px 1px rgb(0 0 0 / 3.5%), 0px 8px 18px 3px rgb(0 0 0 / 4%);
`;

export const OptionContainer = styled.div`
    padding: ${({ theme }) => theme.spacing(0.5)};
`;
