import React from "react";

import { Box, Button as MuiButton, Popover } from "@mui/material";
import PopupState, { bindPopover, bindTrigger } from "material-ui-popup-state";

import { Menu, MenuItem } from "@components/Menu";
import { Root } from "@components/ui/Button.styles";

export interface ButtonProps extends React.ComponentProps<typeof MuiButton> {
    menuItems?: MenuItem[];
}

export function Button({ children, menuItems, ...props }: ButtonProps) {
    const button = (
        <Root {...props}>
            {typeof children === "string" && <span>{children}</span>}
            {typeof children !== "string" && children}
        </Root>
    );

    if (!menuItems || menuItems.length === 0) {
        return button;
    }

    return (
        <PopupState variant="popover" popupId="123">
            {popupState => (
                <>
                    <Root {...props} {...bindTrigger(popupState)}>
                        {typeof children === "string" && <span>{children}</span>}
                        {typeof children !== "string" && children}
                    </Root>
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
                    >
                        <Box mt={1}>
                            <Menu items={menuItems} onClick={popupState.close} />
                        </Box>
                    </Popover>
                </>
            )}
        </PopupState>
    );
}
