import React from "react";

import styled from "@emotion/styled";

import { Slider as MuiSlider, SliderProps as MuiSliderProps } from "@mui/material";

const SliderImpl = styled(MuiSlider)`
    height: 4px;

    & .MuiSlider-rail {
        height: 4px;
        background: #8a8a8a;
    }

    & .MuiSlider-track {
        border: none;
    }

    & .MuiSlider-thumb {
        width: ${({ theme }) => theme.spacing(2.75)};
        height: ${({ theme }) => theme.spacing(2.75)};

        border: 1px solid #e5e5e5;

        background: white;
        box-shadow: none !important;

        &:before {
            content: "";

            width: ${({ theme }) => theme.spacing(1.25)};
            height: ${({ theme }) => theme.spacing(1.25)};

            border-radius: 100%;

            position: absolute;
            top: 50%;
            left: 50%;

            background: ${({ theme }) => theme.palette.primary.main};

            transform: translate(-50%, -50%);
            transition: ${({ theme }) => theme.transitions.create("transform")};

            box-shadow: none;
        }

        &:hover {
            &:before {
                transform: translate(-50%, -50%) scale(1.35);
            }
        }

        &:active {
            &:before {
                transform: translate(-50%, -50%) scale(0.8);
            }
        }
    }
`;

export default function Slider(props: MuiSliderProps) {
    return <SliderImpl {...props} />;
}
