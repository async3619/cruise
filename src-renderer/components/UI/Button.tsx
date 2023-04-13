import React from "react";
import { useNavigate } from "react-router-dom";
import shortid from "shortid";

import { ButtonProps as MuiButtonProps, ClickAwayListener, Grow, Popper, Typography } from "@mui/material";
import ArrowDropDownRoundedIcon from "@mui/icons-material/ArrowDropDownRounded";

import { OptionButton, OptionContainer, OptionWrapper, Root, TextRoot, Wrapper } from "@components/UI/Button.styles";
import ListItem from "@components/List/Item";

export interface ButtonOptionItem {
    label: string;
    value: string;
    icon?: React.ComponentType;
}

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
    variant?: "contained" | "text";
    href?: string;
    children: string;
    icon?: React.ComponentType;
    color?: MuiButtonProps["color"];
    fullWidth?: MuiButtonProps["fullWidth"];
    options?: ButtonOptionItem[];
    onOptionClick?(option: ButtonOptionItem): void;
}

export default function Button({
    variant = "contained",
    href,
    children,
    icon: Icon,
    options,
    onOptionClick,
    onClick,
    ...props
}: ButtonProps) {
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef<HTMLDivElement>(null);
    const internalOptions = React.useMemo(() => {
        return options?.map(option => ({
            ...option,
            id: shortid(),
            onClick: () => {
                onOptionClick?.(option);
                setOpen(false);
            },
        }));
    }, [options, onOptionClick]);

    const handleToggle = () => {
        setOpen(prev => !prev);
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (onClick) {
            onClick(e);
        }

        if (e.defaultPrevented) {
            return;
        }

        if (href) {
            navigate(href);
        }
    };

    const handleClose = (event: Event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
            return;
        }

        setOpen(false);
    };

    const RootComponent = variant === "text" ? TextRoot : Root;

    const content = (
        <RootComponent {...props} onClick={handleClick}>
            {Icon && <Icon />}
            <Typography lineHeight={1}>{children}</Typography>
        </RootComponent>
    );

    if (!internalOptions) {
        return content;
    }

    return (
        <>
            <Wrapper color={props.color} ref={anchorRef}>
                {content}
                <OptionButton onClick={handleToggle}>
                    <ArrowDropDownRoundedIcon />
                </OptionButton>
                <Popper
                    sx={{ zIndex: 1 }}
                    open={open}
                    anchorEl={anchorRef.current}
                    placement="bottom-end"
                    role={undefined}
                    transition
                    disablePortal
                >
                    {({ TransitionProps, placement }) => (
                        <Grow
                            {...TransitionProps}
                            style={{
                                transformOrigin: placement === "bottom" ? "center top" : "center bottom",
                            }}
                        >
                            <OptionWrapper>
                                <ClickAwayListener onClickAway={handleClose}>
                                    <OptionContainer>
                                        {internalOptions.map(item => (
                                            <ListItem
                                                withoutPadding
                                                key={item.id}
                                                label={item.label}
                                                icon={item.icon}
                                                onClick={item.onClick}
                                            />
                                        ))}
                                    </OptionContainer>
                                </ClickAwayListener>
                            </OptionWrapper>
                        </Grow>
                    )}
                </Popper>
            </Wrapper>
        </>
    );
}
