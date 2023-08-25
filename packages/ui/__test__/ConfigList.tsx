import React from "react";
import { ActionConfigListItem, SwitchConfigListItem } from "../src";

export const MOCK_CONFIG = {
    name: "mock",
};

export const SWITCH_CONFIG_LIST_ITEM: SwitchConfigListItem<typeof MOCK_CONFIG> = {
    name: "name",
    icon: <div />,
    label: "label",
    labels: {
        test: "test",
        mock: "mock",
    },
    type: "switch",
};

export const ACTION_CONFIG_LIST_ITEM: ActionConfigListItem<typeof MOCK_CONFIG> = {
    type: "action",
    label: "label",
    description: "description",
    icon: <div />,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    action: () => {},
    button: {
        label: "button",
    },
};
