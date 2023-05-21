import React from "react";
import useMeasure from "react-use-measure";

import { Box, Button, IconButton, Typography } from "@mui/material";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import ExpandLessRoundedIcon from "@mui/icons-material/ExpandLessRounded";

import { ConfigItem, ConfigPanelToolbar } from "@components/Config";
import { Body, Content, ContentWrapper, Header, IconWrapper, Root } from "@components/Config/Panel/Base.styles";

export interface ConfigPanelProps<TConfigItem extends ConfigItem> {
    value: TConfigItem["__value"];
    onChange: (value: TConfigItem["__value"]) => void;
    item: TConfigItem;
}

interface Props<TConfigItem extends ConfigItem> extends ConfigPanelProps<TConfigItem> {
    children?: React.ReactNode;
    toolbar?: ConfigPanelToolbar;
}

export function BaseConfigPanel<TValue>({ children, item, toolbar }: Props<ConfigItem>) {
    const [open, setOpen] = React.useState(false);
    const [measureRef, bound] = useMeasure();
    const Icon = item.icon;

    return (
        <Root>
            <Header>
                {Icon && (
                    <IconWrapper>
                        <Icon />
                    </IconWrapper>
                )}
                <Typography variant="body1" fontSize="0.9rem">
                    {item.label}
                </Typography>
                <Box flex="1 1 auto" />
                {toolbar && (
                    <>
                        {toolbar.type === "action" && (
                            <Button variant="outlined" size="small" onClick={toolbar.onClick}>
                                {toolbar.label}
                            </Button>
                        )}
                        {toolbar.type === "label" && (
                            <Typography variant="body1" fontSize="0.9rem">
                                {toolbar.label}
                            </Typography>
                        )}
                    </>
                )}
                <IconButton sx={{ ml: 1.5 }} size="small" onClick={() => setOpen(o => !o)}>
                    {open ? <ExpandLessRoundedIcon /> : <ExpandMoreRoundedIcon />}
                </IconButton>
            </Header>
            <ContentWrapper style={{ maxHeight: open ? bound.height : 0 }}>
                <Content ref={measureRef}>
                    {item.description && (
                        <Typography variant="body1" fontSize="inherit">
                            {item.description}
                        </Typography>
                    )}
                    <Body>{children}</Body>
                </Content>
            </ContentWrapper>
        </Root>
    );
}
