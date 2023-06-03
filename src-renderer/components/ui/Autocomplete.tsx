import _ from "lodash";

import React from "react";
import useMeasure from "react-use-measure";
import { mergeRefs } from "react-merge-refs";

import { Box, Popper, useAutocomplete } from "@mui/material";

import { List } from "@components/List";
import { ListItem } from "@components/List/Item";

import { noop } from "@utils/noop";
import { Fn } from "@common/types";

import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";

export interface AutocompleteInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    wrapperRef?: React.Ref<HTMLElement>;
    loading?: boolean;
    fullWidth?: boolean;
}

export interface AutocompleteProps<T> {
    renderInput(props: AutocompleteInputProps): React.ReactNode;
    items: T[] | ((query: string) => Promise<T[]>);
    getOptionLabel(item: T): string;
    getOptionIcon(item: T): React.ComponentType;
    fullWidth?: boolean;
    onChange?(text: string, value: T | null): void;
    onKeyDown?(event: React.KeyboardEvent<HTMLInputElement>): void;
}

export function Autocomplete<T>({
    getOptionLabel,
    getOptionIcon,
    renderInput,
    items,
    fullWidth,
    onChange,
    onKeyDown,
}: AutocompleteProps<T>) {
    const [loading, setLoading] = React.useState(false);
    const [options, setOptions] = React.useState<T[]>(Array.isArray(items) ? items : []);
    const [wrapperRef, setWrapperRef] = React.useState<HTMLElement | null>(null);
    const [optionsValue, setOptionsValue] = React.useState<string | null>(null);
    const [measureRef, { width }] = useMeasure();
    const { getRootProps, getInputProps, getListboxProps, getOptionProps, groupedOptions, inputValue, value } =
        useAutocomplete<T>({
            id: "use-autocomplete-demo",
            options,
            getOptionLabel,
            isOptionEqualToValue: _.isEqual,
            autoComplete: true,
            filterSelectedOptions: true,
            clearOnBlur: false,
            clearOnEscape: false,
            filterOptions: Array.isArray(items) ? undefined : x => x,
            onChange: (event, newValue) => {
                if (newValue) {
                    onChange?.(getOptionLabel(newValue), newValue);
                } else {
                    onChange?.("", null);
                }
            },
        });

    const fetchOptions = React.useMemo(() => {
        if (Array.isArray(items)) {
            return noop;
        }

        return _.debounce((query: string, callback: Fn<[T[]]>) => {
            setLoading(true);
            items(query).then(items => {
                setLoading(false);
                callback(items);
            });
        }, 350);
    }, [items]);

    React.useEffect(() => {
        let active = true;
        if (Array.isArray(items)) {
            return;
        }

        if (!inputValue) {
            setOptions([]);
            return;
        }

        fetchOptions(inputValue, results => {
            if (!active) {
                return;
            }

            let newOptions: T[] = [];
            if (value) {
                newOptions = [value];
            }

            if (results) {
                newOptions = [...newOptions, ...results];
            }

            setOptions(newOptions);
            setOptionsValue(inputValue);
        });

        return () => {
            active = false;
        };
    }, [value, inputValue, fetchOptions, items]);

    const inputProps = getInputProps();
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !Array.isArray(items)) {
            setOptions([]);
        }

        inputProps.onKeyDown?.(e);
        onKeyDown?.(e);
    };

    return (
        <Box width={fullWidth ? "100%" : undefined}>
            <Box width={fullWidth ? "100%" : undefined} {...getRootProps()}>
                {renderInput({
                    ...inputProps,
                    wrapperRef: mergeRefs([setWrapperRef, measureRef as React.Ref<HTMLElement>]),
                    loading,
                    fullWidth,
                    onKeyDown: handleKeyDown,
                })}
            </Box>
            <Popper open={groupedOptions.length > 0} anchorEl={wrapperRef} sx={{ zIndex: 1000, width, pt: 1 }}>
                {groupedOptions.length > 0 && (
                    <List {...getListboxProps()}>
                        {(groupedOptions as T[]).map((option, index) => {
                            const label = getOptionLabel(option);
                            const matches = match(label, optionsValue || "", { insideWords: true });
                            const parts = parse(label, matches);

                            return (
                                <ListItem
                                    {...getOptionProps({ option, index })}
                                    key={index}
                                    label={getOptionLabel(option)}
                                    parts={parts}
                                    icon={getOptionIcon(option)}
                                />
                            );
                        })}
                    </List>
                )}
            </Popper>
        </Box>
    );
}
