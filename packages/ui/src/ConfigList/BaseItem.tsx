import React from "react";
import useMeasure from "react-use-measure";

import { Box, Button, Typography } from "@mui/material";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import ExpandLessRoundedIcon from "@mui/icons-material/ExpandLessRounded";

import { Body, Content, Header, IconWrapper, Indicator, Root } from "./BaseItem.styles";
import { BaseConfig, ConfigListItem as ItemType } from "./types";

export interface TextHelperOption {
    type: "text";
    text: string;
}
export interface ButtonHelperOption {
    type: "button";
    label: string;
    onClick: (e: React.MouseEvent) => void;
    disabled?: boolean;
}

export type HelperOption = TextHelperOption | ButtonHelperOption;

export interface BaseConfigListItemProps<TConfig extends BaseConfig> {
    item: ItemType<TConfig>;
    helperOption?: HelperOption;
}

export function BaseConfigListItem<TConfig extends BaseConfig>({
    item,
    children,
    helperOption,
}: React.PropsWithChildren<BaseConfigListItemProps<TConfig>>) {
    const { label, icon } = item;
    const [measureRef, { height }] = useMeasure();
    const [opened, setOpened] = React.useState(false);
    const handleClick = React.useCallback(() => {
        setOpened(prev => !prev);
    }, []);

    const handleButtonClick = React.useCallback(
        (e: React.MouseEvent) => {
            if (helperOption?.type !== "button") {
                return;
            }

            e.stopPropagation();
            helperOption.onClick(e);
        },
        [helperOption],
    );

    let helperItem: React.ReactNode = null;
    if (helperOption) {
        if (helperOption.type === "button") {
            helperItem = (
                <Button
                    size="small"
                    variant="outlined"
                    onClick={handleButtonClick}
                    data-testid="action-button"
                    disabled={helperOption.disabled}
                >
                    {helperOption.label}
                </Button>
            );
        } else if (helperOption.type === "text") {
            helperItem = (
                <Typography variant="body2" lineHeight={1} color="text.secondary" data-testid="action-helper-text">
                    {helperOption.text}
                </Typography>
            );
        }
    }

    return (
        <Root data-testid="BaseConfigListItem" opened={opened}>
            <Header role="button" tabIndex={0} data-testid="header" onClick={handleClick} opened={opened}>
                {icon && <IconWrapper>{icon}</IconWrapper>}
                <Typography variant="body1" fontSize="0.95rem" lineHeight={1}>
                    {label}
                </Typography>
                <Box flex="1 1 auto" />
                {helperItem}
                <Indicator>
                    {opened ? (
                        <ExpandLessRoundedIcon data-testid="opened-icon" />
                    ) : (
                        <ExpandMoreRoundedIcon data-testid="closed-icon" />
                    )}
                </Indicator>
            </Header>
            {children && (
                <Body style={{ maxHeight: opened ? height : 0 }}>
                    <Content ref={measureRef}>{children}</Content>
                </Body>
            )}
        </Root>
    );
}
