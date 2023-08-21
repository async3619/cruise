import React from "react";
import { ConfigList } from "ui";

import { CircularProgress } from "@mui/material";

import { useConfig } from "@components/Config";
import { Page } from "@components/Page";
import { ColorMode } from "@graphql/queries";

import PaletteRoundedIcon from "@mui/icons-material/PaletteRounded";

export function Config() {
    const { config, setConfig } = useConfig();

    return (
        <Page title="Config">
            {!config && <CircularProgress />}
            {config && (
                <ConfigList
                    onChange={setConfig}
                    config={config}
                    items={[
                        {
                            icon: <PaletteRoundedIcon />,
                            name: "colorMode",
                            type: "switch",
                            label: "Color Mode",
                            labels: {
                                Light: ColorMode.Light,
                                Dark: ColorMode.Dark,
                                System: ColorMode.System,
                            },
                        },
                    ]}
                />
            )}
        </Page>
    );
}
