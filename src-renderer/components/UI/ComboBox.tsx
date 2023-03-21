import React from "react";

import { Typography } from "@mui/material";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";

import ComboBoxPopper from "@components/UI/ComboBox/Popper";

import { Icon, NormalGraphics, NormalRoot, OutlineGraphics, OutlineRoot } from "@components/UI/ComboBox.styles";

export interface ComboBoxItem<TData> {
    label: string;
    value: TData;
}

export type ComboBoxVariant = "default" | "outlined";

export interface ComboBoxProps<TData> {
    items: ComboBoxItem<TData>[];
    label?: string;
    value?: TData;
    onChange?(value: TData): void;
    variant?: ComboBoxVariant;
}
export interface ComboBoxStates {
    anchorEl: HTMLElement | null;
}

export default class ComboBox<TData> extends React.Component<ComboBoxProps<TData>, ComboBoxStates> {
    public state: ComboBoxStates = {
        anchorEl: null,
    };

    private handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();

        this.setState({ anchorEl: e.currentTarget });
    };
    private handleSelect = (value: TData) => {
        this.props.onChange?.(value);
    };
    private handleClose = () => {
        this.setState({ anchorEl: null });
    };

    public render() {
        const { label, items, variant = "default", value } = this.props;
        const { anchorEl } = this.state;
        const currentItem = items.find(item => item.value === value);
        const Graphics = variant === "outlined" ? OutlineGraphics : NormalGraphics;
        const Root = variant === "outlined" ? OutlineRoot : NormalRoot;

        return (
            <>
                <Root onClick={this.handleClick} open={Boolean(anchorEl)}>
                    <Typography variant="body1" fontSize="inherit" lineHeight={1}>
                        {label ? `${label}: ` : ""}
                        <Typography component="span" color={label ? "primary.main" : undefined} lineHeight={1}>
                            {currentItem?.label}
                        </Typography>
                    </Typography>
                    <Graphics open={Boolean(anchorEl)} />
                    <Icon>
                        <KeyboardArrowDownRoundedIcon />
                    </Icon>
                </Root>
                <ComboBoxPopper
                    anchorEl={anchorEl}
                    onClose={this.handleClose}
                    onSelect={this.handleSelect}
                    items={items}
                    value={value}
                />
            </>
        );
    }
}
