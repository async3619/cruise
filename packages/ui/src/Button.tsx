import React from "react";

import { ButtonProps as MuiButtonProps, Button as MuiButton, Popover } from "@mui/material";
import PopupState, { bindPopover, bindTrigger } from "material-ui-popup-state";

import { Menu, MenuItem } from "./Menu";

export interface ButtonProps extends MuiButtonProps {
    menuItems?: MenuItem[];
}

export function Button({ children, menuItems, ...props }: ButtonProps) {
    const buttonChildren = (
        <>
            {typeof children === "string" && <span>{children}</span>}
            {typeof children !== "string" && children}
        </>
    );

    if (!menuItems || menuItems.length === 0) {
        return (
            <MuiButton {...props} data-testid="Button">
                {buttonChildren}
            </MuiButton>
        );
    }

    return (
        <PopupState variant="popover" popupId="popup">
            {popupState => (
                <>
                    <MuiButton {...props} {...bindTrigger(popupState)} data-testid="Button">
                        {buttonChildren}
                    </MuiButton>
                    <Popover
                        {...bindPopover(popupState)}
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "center",
                        }}
                        transformOrigin={{
                            vertical: "top",
                            horizontal: "center",
                        }}
                        sx={{ mt: 1 }}
                    >
                        <Menu standalone={false} items={menuItems} onClick={popupState.close} />
                    </Popover>
                </>
            )}
        </PopupState>
    );
}
