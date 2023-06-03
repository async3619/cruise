import React from "react";

import { CircularProgress, InputAdornment, InputBase, useTheme } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import { Root } from "@components/ui/SearchInput.styles";

export interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    wrapperRef?: React.Ref<HTMLElement>;
    loading?: boolean;
    fullWidth?: boolean;
}

export const SearchInput = React.forwardRef((props: SearchInputProps, ref: React.Ref<HTMLInputElement>) => {
    const theme = useTheme();
    const { fullWidth, placeholder, wrapperRef, loading, ...rest } = props;

    return (
        <Root ref={wrapperRef as React.Ref<HTMLLabelElement>} fullWidth={fullWidth}>
            <InputBase
                inputProps={{ ref, ...rest }}
                fullWidth={fullWidth}
                placeholder={placeholder}
                startAdornment={
                    <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                    </InputAdornment>
                }
                endAdornment={
                    loading && (
                        <InputAdornment position="end">
                            <CircularProgress size={theme.spacing(2)} />
                        </InputAdornment>
                    )
                }
            />
        </Root>
    );
});
