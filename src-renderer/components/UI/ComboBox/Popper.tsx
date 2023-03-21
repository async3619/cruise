import React from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import memoizeOne from "memoize-one";

import { ClickAwayListener } from "@mui/material";

import ListItem from "@components/List/Item";
import { ComboBoxItem } from "@components/UI/ComboBox";

import { List, PopperRoot, Root } from "@components/UI/ComboBox/Popper.styles";

export interface ComboBoxPopperProps<TData> {
    anchorEl: HTMLElement | null;
    onClose(): void;
    onSelect?(value: TData): void;
    items: ComboBoxItem<TData>[];
    value?: TData;
}
export interface ComboBoxPopperStates {}

export default class ComboBoxPopper<TData> extends React.Component<ComboBoxPopperProps<TData>, ComboBoxPopperStates> {
    private handleClick = memoizeOne((value: TData) => () => {
        const { onSelect, onClose, items } = this.props;
        const item = items.find(item => item.value === value);
        if (!item) {
            return;
        }

        onClose();
        onSelect?.(item.value);
    });

    private renderItem = (item: ComboBoxItem<TData>, index: number) => {
        const { value } = this.props;

        return (
            <ListItem
                key={index}
                withoutPadding
                label={item.label}
                onClick={this.handleClick(item.value)}
                selected={value === item.value}
            />
        );
    };
    public render() {
        const { anchorEl, onClose, items } = this.props;

        return (
            <ClickAwayListener onClickAway={onClose}>
                <PopperRoot open={Boolean(anchorEl)} anchorEl={anchorEl} placement="bottom">
                    <Root style={{ width: anchorEl?.clientWidth }}>
                        <Scrollbars autoHeight>
                            <List>{items.map(this.renderItem)}</List>
                        </Scrollbars>
                    </Root>
                </PopperRoot>
            </ClickAwayListener>
        );
    }
}
