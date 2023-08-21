import React from "react";
import { SwitchConfigListItem } from "../src";

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
