import React from "react";
import useMeasure from "react-use-measure";

import { AsyncFn, Fn, Nullable } from "types";

import { Popper, Typography, useAutocomplete } from "@mui/material";

import { Icon, List, Option, Root } from "./Autocomplete.styles";
import { mergeRefs } from "../utils/mergeRefs";

export interface BaseAutocompleteProps<TItem> {
    getItemLabel: Fn<[TItem], string>;
    getItemIcon?: Fn<[TItem], React.ReactNode>;
    getItemKey?: Fn<[TItem], string>;
    renderInput: Fn<[React.InputHTMLAttributes<HTMLInputElement>, boolean], React.ReactNode>;
    fullWidth?: boolean;
}

export interface StaticAutocompleteProps<TItem> extends BaseAutocompleteProps<TItem> {
    items: ReadonlyArray<TItem>;
}
export interface AsyncAutocompleteProps<TItem> extends BaseAutocompleteProps<TItem> {
    items: AsyncFn<[], TItem[]>;
}

export type AutocompleteProps<TItem> = StaticAutocompleteProps<TItem> | AsyncAutocompleteProps<TItem>;

export function Autocomplete<TItem>({
    items,
    getItemLabel,
    renderInput,
    fullWidth = false,
    getItemIcon,
    getItemKey,
}: AutocompleteProps<TItem>) {
    const [currentItems, setCurrentItems] = React.useState<Nullable<ReadonlyArray<TItem>>>(null);
    const [rootRef, setRootRef] = React.useState<Nullable<HTMLDivElement>>(null);
    const [measureRef, { width }] = useMeasure();
    const [loading, setLoading] = React.useState(false);
    const [focused, setFocused] = React.useState(false);

    React.useEffect(() => {
        if (!focused || currentItems !== null) {
            return;
        }

        let removed = false;
        if (typeof items === "function") {
            setLoading(true);
            items().then(items => {
                if (removed) {
                    return;
                }

                setCurrentItems(items);
                setLoading(false);
            });
        } else {
            setCurrentItems(items);
        }

        return () => {
            removed = true;
        };
    }, [items, focused, currentItems]);

    const { getRootProps, getInputProps, getListboxProps, getOptionProps, groupedOptions } = useAutocomplete<TItem>({
        options: currentItems ?? [],
        getOptionLabel: getItemLabel,
        clearOnBlur: false,
        clearOnEscape: false,
        autoComplete: true,
    });

    let inputProps = getInputProps();
    const oldFocus = inputProps.onFocus;
    const handleFocus = React.useCallback(
        (e: React.FocusEvent<HTMLInputElement>) => {
            setFocused(true);
            oldFocus?.(e);
        },
        [oldFocus],
    );

    const oldBlur = inputProps.onBlur;
    const handleBlur = React.useCallback(
        (e: React.FocusEvent<HTMLInputElement>) => {
            setFocused(false);
            oldBlur?.(e);
        },
        [oldBlur],
    );

    inputProps = {
        ...inputProps,
        onFocus: handleFocus,
        onBlur: handleBlur,
    };

    const opened = groupedOptions.length > 0;
    const rootRefObject = mergeRefs([measureRef, setRootRef as Fn<[HTMLDivElement | null]>]);

    return (
        <>
            <Root fullWidth={fullWidth} ref={rootRefObject} data-testid="Autocomplete" {...getRootProps()}>
                {renderInput(inputProps, loading)}
            </Root>
            <Popper open={opened} anchorEl={rootRef} sx={{ zIndex: 1000 }}>
                <List {...getListboxProps()} style={{ width }}>
                    {(groupedOptions as TItem[]).map((option, index) => {
                        const props: React.HTMLAttributes<HTMLLIElement> & { key?: string } = getOptionProps({
                            option,
                            index,
                        });

                        if (getItemKey) {
                            props.key = getItemKey(option);
                        }

                        return (
                            <Option {...props} data-testid="suggestion-option">
                                {getItemIcon && <Icon>{getItemIcon(option)}</Icon>}
                                <Typography
                                    color="inherit"
                                    variant="body1"
                                    whiteSpace="nowrap"
                                    overflow="hidden"
                                    fontSize="inherit"
                                    textOverflow="ellipsis"
                                >
                                    {getItemLabel(option)}
                                </Typography>
                            </Option>
                        );
                    })}
                </List>
            </Popper>
        </>
    );
}
