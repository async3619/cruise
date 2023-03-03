import { Radio } from "@mui/material";
import styled from "@emotion/styled";

export const Root = styled(Radio)``;

export const Icon = styled.span`
    width: ${({ theme }) => theme.spacing(2.5)};
    height: ${({ theme }) => theme.spacing(2.5)};

    border: 1px solid #898989;
    border-radius: 100%;

    position: relative;

    background: #f1f1f1;

    transition: ${({ theme }) => theme.transitions.create(["background", "border-color"])};

    input:hover ~ & {
        background: #e8e8e8;
    }

    input:active ~ & {
        border-color: #b9b9bb;
        background: #e0e0e2;

        &:before {
            transform: translate(-50%, -50%) scale(1);
        }
    }

    &:before {
        content: "";

        width: ${({ theme }) => theme.spacing(1.25)};
        height: ${({ theme }) => theme.spacing(1.25)};

        border-radius: 100%;

        position: absolute;
        top: 50%;
        left: 50%;

        background: #fff;

        transform: translate(-50%, -50%) scale(0);
        transition: ${({ theme }) => theme.transitions.create(["transform"])};
    }
`;

export const CheckedIcon = styled(Icon)`
    border-color: ${({ theme }) => theme.palette.primary.main};
    background: ${({ theme }) => theme.palette.primary.main};

    &:before {
        transform: translate(-50%, -50%) scale(1);
    }

    input:hover ~ & {
        border-color: ${({ theme }) => theme.palette.primary.main};
        background: ${({ theme }) => theme.palette.primary.main};

        &:before {
            transform: translate(-50%, -50%) scale(1.3);
        }
    }

    input:active ~ & {
        border-color: ${({ theme }) => theme.palette.primary.main};
        background: ${({ theme }) => theme.palette.primary.main};

        &:before {
            transform: translate(-50%, -50%) scale(1);
        }
    }
`;
