import React from "react";
import parse from "autosuggest-highlight/parse";

import { Typography } from "@mui/material";

import { NormalListItem } from "@components/List/index.types";
import { Button, Root } from "@components/List/Item.styles";

export interface BaseListItemProps {
    withoutPadding?: boolean;
}

export interface NormalListItemProps extends BaseListItemProps {
    item: NormalListItem;
    onClick?(item: NormalListItem): void;
    active: boolean;
}
export interface StandaloneListItemProps extends BaseListItemProps, React.HTMLAttributes<HTMLDivElement> {
    label: string | ReturnType<typeof parse>;
    icon?: React.ComponentType;
    selected?: boolean;
}

export type ListItemProps = NormalListItemProps | StandaloneListItemProps;

export default class ListItem extends React.Component<ListItemProps> {
    public handleClick = () => {
        if (!("item" in this.props)) {
            return;
        }

        const { onClick, item } = this.props;
        if (!onClick) {
            return;
        }

        onClick(item);
    };

    render() {
        const { withoutPadding } = this.props;
        let Icon: React.ComponentType | null;

        let label: React.ReactNode;
        let active = false;
        let selected = false;
        let restProps: React.HTMLAttributes<HTMLDivElement> = {};
        if ("item" in this.props) {
            label = this.props.item.label;
            active = this.props.active;
            Icon = this.props.item.icon;
        } else {
            const { label: _, icon: __, ...rest } = this.props;

            if (typeof this.props.label === "string") {
                label = this.props.label;
            } else {
                label = this.props.label.map((part, index) => (
                    <Typography
                        key={index}
                        component="span"
                        fontWeight={part.highlight ? 900 : "inherit"}
                        color={part.highlight ? "primary.main" : "inherit"}
                    >
                        {part.text}
                    </Typography>
                ));
            }

            Icon = this.props.icon || null;
            selected = this.props.selected || false;
            restProps = rest;
        }

        return (
            <Root withoutPadding={withoutPadding} {...restProps}>
                <Button onClick={this.handleClick} active={active || selected}>
                    {Icon && <Icon />}
                    <Typography variant="body1" lineHeight={1}>
                        {label}
                    </Typography>
                </Button>
            </Root>
        );
    }
}
