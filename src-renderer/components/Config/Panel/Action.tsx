import React from "react";

import { ActionConfigItem } from "@components/Config";
import { BaseConfigPanel, ConfigPanelProps } from "@components/Config/Panel/Base";

export function ActionConfigPanel(props: ConfigPanelProps<ActionConfigItem>) {
    return <BaseConfigPanel {...props} toolbar={props.item.action} />;
}
