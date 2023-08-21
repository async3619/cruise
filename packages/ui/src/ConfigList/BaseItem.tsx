import React from "react";
import useMeasure from "react-use-measure";

import { Box, Typography } from "@mui/material";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import ExpandLessRoundedIcon from "@mui/icons-material/ExpandLessRounded";

import { Body, Content, Header, IconWrapper, Indicator, Root } from "./BaseItem.styles";
import { BaseConfig, BaseConfigListItem as ItemType } from "./types";

export interface BaseConfigListItemProps<TConfig extends BaseConfig> {
    item: ItemType<TConfig>;
}

export function BaseConfigListItem<TConfig extends BaseConfig>({
    item,
    children,
}: React.PropsWithChildren<BaseConfigListItemProps<TConfig>>) {
    const { label, icon } = item;
    const [measureRef, { height }] = useMeasure();
    const [opened, setOpened] = React.useState(false);

    const handleClick = React.useCallback(() => {
        setOpened(prev => !prev);
    }, []);

    return (
        <Root data-testid="BaseConfigListItem" opened={opened}>
            <Header data-testid="header" role="button" tabIndex={0} onClick={handleClick} opened={opened}>
                {icon && <IconWrapper>{icon}</IconWrapper>}
                <Typography variant="body1" fontSize="0.95rem" lineHeight={1}>
                    {label}
                </Typography>
                <Box flex="1 1 auto" />
                <Indicator>
                    {opened ? (
                        <ExpandLessRoundedIcon data-testid="opened-icon" />
                    ) : (
                        <ExpandMoreRoundedIcon data-testid="closed-icon" />
                    )}
                </Indicator>
            </Header>
            <Body style={{ maxHeight: opened ? height : 0 }}>
                <Content ref={measureRef}>{children}</Content>
            </Body>
        </Root>
    );
}
