import React from "react";
import useMeasure from "react-use-measure";

import { Box, Typography } from "@mui/material";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";

import IconButton from "@components/UI/IconButton";
import Button from "@components/UI/Button";
import { useSettings } from "@components/Settings/context";
import { BaseSettingsItem, SettingsItem } from "@components/Settings/types";

import { Content, ContentWrapper, IconWrapper, Root, Wrapper } from "@components/Settings/ListItem/Base.styles";

export interface BaseSettingsListItemProps {
    item: BaseSettingsItem<any>;
    children?: React.ReactNode;
    onButtonClick?(e: React.MouseEvent<HTMLButtonElement>): void;
    renderTail?(): React.ReactNode;
}

export default function BaseSettingsListItem(props: BaseSettingsListItemProps) {
    const { item, children, renderTail } = props;
    const { title, icon: Icon, button } = item;
    const [opened, setOpened] = React.useState(false);
    const [ref, bounds] = useMeasure();
    const settings = useSettings();

    const handleClick = () => {
        setOpened(!opened);
    };

    const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        const { onButtonClick } = props;
        if (onButtonClick) {
            onButtonClick(e);
        }

        if (settings.onButtonClick) {
            settings.onButtonClick(item as SettingsItem);
        }

        e.stopPropagation();
    };

    return (
        <Wrapper opened={opened}>
            <Root role="button" tabIndex={-1} onClick={handleClick}>
                <Typography lineHeight={1}>{title}</Typography>
                {Icon && (
                    <IconWrapper>
                        <Icon />
                    </IconWrapper>
                )}
                <Box flex="1 1 auto" />
                {button && (
                    <Button onClick={handleButtonClick} icon={button.icon}>
                        {button.label}
                    </Button>
                )}
                {renderTail && renderTail()}
                {children && (
                    <Box ml={2.5}>
                        <IconButton>
                            <ExpandMoreRoundedIcon />
                        </IconButton>
                    </Box>
                )}
                {!children && <Box width={52} />}
            </Root>
            {children && (
                <ContentWrapper style={{ height: opened ? bounds.height : 0 }}>
                    <Content ref={ref}>{children}</Content>
                </ContentWrapper>
            )}
        </Wrapper>
    );
}
