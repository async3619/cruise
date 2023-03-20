import React from "react";

import { Typography } from "@mui/material";

import {
    EndAdornment,
    FullWidthLabel,
    FullWidthRoot,
    Graphics,
    InputWrapper,
    Label,
    Root,
    Wrapper,
} from "@components/UI/TextField.styles";

export interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    fullWidth?: boolean;
    label?: string;
    error?: boolean;
    open?: boolean;
    wrapperRef?: React.Ref<HTMLLabelElement>;
    startAdornment?: React.ReactNode;
    endAdornment?: React.ReactNode;
}

const TextField = React.forwardRef((props: TextFieldProps, ref: React.Ref<HTMLInputElement>) => {
    const { open, label, error, fullWidth, startAdornment, wrapperRef, endAdornment } = props;
    const Component = fullWidth ? FullWidthRoot : Root;
    const LabelComponent = fullWidth ? FullWidthLabel : Label;

    return (
        <LabelComponent ref={wrapperRef} error={error} open={open}>
            {label && (
                <Typography variant="body1" color={error ? "error.main" : undefined} fontSize="0.9rem">
                    {label}
                </Typography>
            )}
            <Wrapper withAdornment={!!startAdornment}>
                {startAdornment}
                <InputWrapper>
                    <Component ref={ref} {...props} />
                </InputWrapper>
                <Graphics />
                {endAdornment && <EndAdornment>{endAdornment}</EndAdornment>}
            </Wrapper>
        </LabelComponent>
    );
});

export default TextField;
