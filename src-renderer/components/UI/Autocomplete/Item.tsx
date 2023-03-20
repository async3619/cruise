import React from "react";
import type { FieldPath, FieldValues } from "react-hook-form";
import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";

import { AutocompleteRenderOptionState } from "@mui/material";

import ListItem from "@components/List/Item";

import { getFromPath } from "@utils/fieldPath";

export interface AutocompleteItemProps<TItem extends FieldValues> extends React.HTMLAttributes<HTMLElement> {
    option: TItem | string;
    labelField: FieldPath<TItem>;
    state: AutocompleteRenderOptionState;
    search: string;
}

export default function AutocompleteItem<TItem extends FieldValues>({
    labelField,
    option,
    state: { selected },
    className: _,
    search,
    ...rest
}: AutocompleteItemProps<TItem>) {
    let label: string | ReturnType<typeof parse>;
    if (typeof option === "string") {
        label = option;
    } else {
        const data = getFromPath(option, labelField);
        const matches = match(data || "", search, { insideWords: true });
        label = parse(data || "", matches);
    }

    return <ListItem withoutPadding label={label} selected={selected} {...rest} />;
}
