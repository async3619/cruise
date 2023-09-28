import React from "react";

import { CircularProgress } from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

import { Icon, Input, Loading, Root } from "@components/SearchInput.styles";

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    loading: boolean;
}

export const SearchInput = React.forwardRef(
    ({ loading, ...props }: SearchInputProps, ref: React.Ref<HTMLInputElement>) => {
        return (
            <Root>
                <Input ref={ref} {...props} />
                <Icon>
                    <SearchRoundedIcon />
                </Icon>
                <Loading>
                    <CircularProgress disableShrink size={16} sx={{ opacity: loading ? 1 : 0 }} />
                </Loading>
            </Root>
        );
    },
);

SearchInput.displayName = "SearchInput";
