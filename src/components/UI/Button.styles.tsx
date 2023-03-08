import styled from "@emotion/styled";
import { Button } from "@mui/material";

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
