import React from "react";

import { Typography } from "@mui/material";

import { BaseConfigListItem } from "./BaseItem";
import { BaseConfig, BaseConfigListProps, ActionConfigListItem as ItemType } from "./types";

export interface ActionConfigListItemProps<TConfig extends BaseConfig>
    extends BaseConfigListProps<TConfig, ItemType<TConfig>> {}

export function ActionConfigListItem<TConfig extends BaseConfig>({ item }: ActionConfigListItemProps<TConfig>) {
    let children: React.ReactNode = null;
    if (item.description) {
        children = (
            <Typography variant="body2" color="text.secondary" data-testid="ActionConfigListItem">
                {item.description}
            </Typography>
        );
    }

    return (
        <BaseConfigListItem
            item={item}
            children={children}
            helperOption={{
                type: "button",
                label: item.button.label,
                onClick: item.action,
                disabled: item.button.disabled,
            }}
        />
    );
}
