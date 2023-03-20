import _ from "lodash";
import React from "react";
import { mergeRefs } from "react-merge-refs";

import {
    Autocomplete as MuiAutocomplete,
    AutocompleteRenderInputParams,
    AutocompleteRenderOptionState,
    AutocompleteRenderGetTagProps,
    FilterOptionsState,
    Box,
    Chip,
    CircularProgress,
    createFilterOptions,
} from "@mui/material";

import TextField from "@components/UI/TextField";

import AutocompletePaper from "@components/UI/Autocomplete/Paper";
import AutocompleteListbox from "@components/UI/Autocomplete/Listbox";
import AutocompleteItem from "@components/UI/Autocomplete/Item";

import { Root } from "@components/UI/Autocomplete/index.styles";

import { BaseObject, FieldPath, getFromPath } from "@utils/fieldPath";

export interface BaseAutocompleteProps<TItem extends BaseObject> {
    options: TItem[] | (() => Promise<TItem[]>);
    labelField: FieldPath<TItem>;
    idField: FieldPath<TItem>;
    onChange?(e: React.SyntheticEvent, value: string): void;
    label?: string;
    value: Array<string | TItem>;
    inputRef?: React.Ref<HTMLInputElement>;
    error?: boolean;
}
export interface SingularAutocompleteProps<TItem extends BaseObject> extends BaseAutocompleteProps<TItem> {
    multiple?: false;
    onSelect?(e: React.SyntheticEvent, value: TItem | string): void;
}
export interface MultipleAutocompleteProps<TItem extends BaseObject> extends BaseAutocompleteProps<TItem> {
    multiple: true;
    onSelect?(e: React.SyntheticEvent, value: Array<TItem | string>): void;
}

export type AutocompleteProps<TItem extends BaseObject> =
    | SingularAutocompleteProps<TItem>
    | MultipleAutocompleteProps<TItem>;

export interface AutocompleteStates<TItem extends BaseObject> {
    open: boolean;
    items: Array<TItem | string> | null;
    inputValue: string;
    fetchOptions(callback: (items: TItem[]) => void): void;
    loading: boolean;
}

export default class Autocomplete<TItem extends BaseObject> extends React.Component<
    AutocompleteProps<TItem>,
    AutocompleteStates<TItem>
> {
    private readonly filter = createFilterOptions<TItem | string>();
    private unmounted = false;

    public state: AutocompleteStates<TItem> = {
        open: false,
        items: typeof this.props.options === "function" ? null : this.props.options,
        inputValue: "",
        fetchOptions: _.debounce((callback: (items: TItem[]) => void) => {
            if (typeof this.props.options === "function") {
                this.props.options().then(callback);
            }
        }, 400),
        loading: false,
    };

    public componentDidUpdate(
        prevProps: Readonly<AutocompleteProps<TItem>>,
        prevState: Readonly<AutocompleteStates<TItem>>,
    ) {
        const { options } = this.props;
        const { open, loading, items } = this.state;
        const needFetch = typeof options === "function" && !loading && open && !prevState.open && !items;

        if (needFetch) {
            this.loadData();
        }
    }
    public componentWillUnmount() {
        this.unmounted = true;
    }

    private isOptionEqualToValue = (option: TItem | string, value: TItem | string) => {
        const { idField } = this.props;

        if (typeof option === "string") {
            if (typeof value === "string") {
                return option === value;
            }

            return false;
        }

        if (typeof value === "string") {
            return false;
        }

        return getFromPath(option, idField) === getFromPath(value, idField);
    };
    private getOptionLabel = (option: string | TItem) => {
        if (typeof option === "string") {
            return option;
        }

        const { labelField } = this.props;
        return getFromPath(option, labelField) as string;
    };
    private filterOptions = (options: Array<TItem | string>, params: FilterOptionsState<TItem | string>) => {
        const { multiple } = this.props;
        if (!multiple) {
            return options;
        }

        const filtered = this.filter(options, params);
        const { inputValue } = params;
        const isExisting = options.some(option => inputValue === this.getOptionLabel(option));
        if (inputValue !== "" && !isExisting) {
            filtered.push(`Add '${inputValue}'`);
        }

        return filtered;
    };
    private loadData = () => {
        const { options } = this.props;
        const { fetchOptions } = this.state;
        if (typeof options !== "function") {
            return undefined;
        }

        this.setState({ loading: true });
        fetchOptions(items => {
            if (this.unmounted) {
                return;
            }

            this.setState({ items, loading: false });
        });
    };

    private handleOpen = () => {
        this.setState({ open: true });
    };
    private handleClose = () => {
        this.setState({ open: false });
    };
    private handleInputChange = (e: React.SyntheticEvent, value: string) => {
        this.setState({ inputValue: value });
        this.props.onChange?.(e, value);
    };
    private handleChange = (e: React.SyntheticEvent, value: Array<TItem | string> | (TItem | string)) => {
        if (Array.isArray(value)) {
            value = value.map(v => {
                if (typeof v === "string") {
                    return v.replace(/^Add '(.*)'$/, "$1");
                }

                return v;
            });
        } else if (typeof value === "string") {
            value = value.replace(/^Add '(.*)'$/, "$1");
        }

        if (this.props.multiple) {
            this.props.onSelect?.(e, value as Array<TItem | string>);
            return;
        }

        this.props.onSelect?.(e, value as TItem | string);
    };

    private renderInput = (params: AutocompleteRenderInputParams) => {
        const { open, loading } = this.state;
        const { label, inputRef, error } = this.props;

        return (
            <TextField
                {...params.inputProps}
                ref={mergeRefs([(params.inputProps as any).ref, inputRef])}
                wrapperRef={params.InputProps.ref}
                label={label}
                open={open}
                error={error}
                startAdornment={params.InputProps.startAdornment}
                endAdornment={loading && <CircularProgress size={16} sx={{ display: "block" }} />}
            />
        );
    };
    private renderOption = (
        props: React.HTMLAttributes<HTMLElement>,
        option: TItem | string,
        state: AutocompleteRenderOptionState,
    ) => {
        const { inputValue } = this.state;

        return (
            <AutocompleteItem
                {...props}
                option={option}
                labelField={this.props.labelField}
                state={state}
                search={inputValue}
            />
        );
    };
    private renderTags = (value: Array<TItem | string>, getTagProps: AutocompleteRenderGetTagProps) => {
        const { labelField } = this.props;

        return value.map((item, index) => {
            const { className: _, key, ...props } = getTagProps({ index });
            if (typeof item === "string") {
                item = item.replace(/^Add '(.*)'$/, "$1");

                return (
                    <Box key={key} pl={1} height={32} display="flex" alignItems="center">
                        <Chip size="small" label={item} {...props} />
                    </Box>
                );
            }

            const label = getFromPath(item, labelField);

            return (
                <Box key={key} pl={1} height={32} display="flex" alignItems="center">
                    <Chip size="small" label={label} {...props} />
                </Box>
            );
        });
    };

    public render() {
        const { multiple, value } = this.props;
        const { open, items, inputValue, loading } = this.state;

        return (
            <Root>
                <MuiAutocomplete
                    disableClearable
                    freeSolo
                    handleHomeEndKeys
                    value={value}
                    options={items || []}
                    open={open}
                    multiple={multiple}
                    inputValue={inputValue}
                    loading={loading}
                    filterOptions={this.filterOptions}
                    onOpen={this.handleOpen}
                    onClose={this.handleClose}
                    onChange={this.handleChange}
                    onInputChange={this.handleInputChange}
                    isOptionEqualToValue={this.isOptionEqualToValue}
                    getOptionLabel={this.getOptionLabel}
                    renderInput={this.renderInput}
                    renderOption={this.renderOption}
                    renderTags={this.renderTags}
                    PaperComponent={AutocompletePaper}
                    ListboxComponent={AutocompleteListbox}
                />
            </Root>
        );
    }
}
