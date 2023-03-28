import React from "react";

import StringList from "@components/UI/StringList";

import BaseSettingsListItem from "@components/Settings/ListItem/Base";
import { PathListSettingsItem, SettingsListItemProps } from "@components/Settings/types";

import { useApolloClient } from "@apollo/client";
import { SelectPathDocument, SelectPathMutation, SelectPathMutationVariables } from "@queries";

export interface PathListSettingsListItemProps extends SettingsListItemProps<PathListSettingsItem> {}

export default function PathListSettingsListItem(props: PathListSettingsListItemProps) {
    const { item, value, onChange } = props;
    const client = useApolloClient();

    const handleChange = (items: string[]) => {
        onChange(item, items);
    };

    const handleAddPathClick = async () => {
        const { data } = await client.mutate<SelectPathMutation, SelectPathMutationVariables>({
            mutation: SelectPathDocument,
            variables: {
                options: {
                    directory: true,
                },
            },
        });

        if (!data?.selectPath || data.selectPath.length === 0) {
            return;
        }

        const targetPath = data.selectPath.length === 1 ? data.selectPath[0] : data.selectPath;
        let newValues = value;
        if (Array.isArray(targetPath)) {
            newValues = [...newValues, ...targetPath];
        } else {
            newValues = [...newValues, targetPath];
        }

        onChange(item, newValues);
    };

    return (
        <BaseSettingsListItem item={item} onButtonClick={handleAddPathClick}>
            <StringList items={value} onChange={handleChange} />
        </BaseSettingsListItem>
    );
}
