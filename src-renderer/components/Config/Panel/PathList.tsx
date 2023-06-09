import _ from "lodash";

import React from "react";
import { useTranslation } from "react-i18next";

import { Box, Button, Stack, Typography } from "@mui/material";

import { PathListConfigItem } from "@components/Config";
import { BaseConfigPanel, ConfigPanelProps } from "@components/Config/Panel/Base";
import { Item } from "@components/Config/Panel/PathList.styles";

import { useSelectPathMutation } from "@queries";

export function PathListConfigPanel(props: ConfigPanelProps<PathListConfigItem>) {
    const { t } = useTranslation();
    const [selectPath] = useSelectPathMutation();
    const {
        item: { pathType },
    } = props;

    const handleAdd = async () => {
        const { data } = await selectPath({
            variables: {
                options: {
                    directory: pathType === "directory",
                    multiple: false,
                },
            },
        });

        if (!data?.selectPath) {
            return;
        }

        props.onChange(_.uniq([...props.value, ...data.selectPath]));
    };

    const handleDelete = (item: string) => {
        props.onChange(props.value.filter(i => i !== item));
    };

    return (
        <BaseConfigPanel
            toolbar={{
                type: "action",
                label: props.item.actionLabel || "Add Path",
                onClick: handleAdd,
            }}
            {...props}
        >
            <Stack spacing={2}>
                {props.value.map((item, index) => (
                    <Item key={index}>
                        <Typography fontSize="0.9rem">{item}</Typography>
                        <Box flex="1 1 auto" />
                        <Button
                            variant="outlined"
                            size="small"
                            color="error"
                            onClick={() => handleDelete(item)}
                            disabled={props.value.length === 1}
                        >
                            {t("common.delete")}
                        </Button>
                    </Item>
                ))}
            </Stack>
        </BaseConfigPanel>
    );
}
