import React from "react";

import { Icon, Root, WindowControlButtonTypes } from "./WindowControlButton.styles";

const ControlButtonIcons: Record<WindowControlButtonTypes, React.ComponentType> = {
    minimize: () => (
        <Icon x="0px" y="0px" viewBox="0 0 10.2 1">
            <rect width="10.2" height="1" />
        </Icon>
    ),
    maximize: () => (
        <Icon x="0px" y="0px" viewBox="0 0 10.2 10.1">
            <path d="M0,0v10.1h10.2V0H0z M9.2,9.2H1.1V1h8.1V9.2z" />
        </Icon>
    ),
    close: () => (
        <Icon x="0px" y="0px" viewBox="0 0 10.2 10.2">
            <polygon points="10.2,0.7 9.5,0 5.1,4.4 0.7,0 0,0.7 4.4,5.1 0,9.5 0.7,10.2 5.1,5.8 9.5,10.2 10.2,9.5 5.8,5.1 " />
        </Icon>
    ),
};

export interface WindowControlButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
    type: WindowControlButtonTypes;
}

export function WindowControlButton({ type, ...rest }: WindowControlButtonProps) {
    const Icon = ControlButtonIcons[type];

    return (
        <Root buttonType={type} {...rest}>
            <Icon />
        </Root>
    );
}
