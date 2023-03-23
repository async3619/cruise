import React from "react";
import { useNavigate } from "react-router-dom";

import { Hidden, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";

import { useLayout } from "@components/Layout/useLayout";
import WindowControl from "@components/WindowControl";
import { BackButton, Icon, Root } from "@components/TitleBar.styles";

import useHistoryStack from "@utils/useHistoryStack";

export default function TitleBar() {
    const navigate = useNavigate();
    const historyStack = useHistoryStack();
    const layout = useLayout();

    const handleBack = () => {
        navigate(-1);
    };

    const handleMenuClick = () => {
        layout.setSideBarOpen(!layout.sideBarOpen);
    };

    return (
        <Root data-tauri-drag-region>
            <BackButton onClick={handleBack} disabled={!historyStack.length}>
                <ArrowBackIcon />
            </BackButton>
            <Hidden smUp>
                <BackButton onClick={handleMenuClick}>
                    <MenuRoundedIcon />
                </BackButton>
            </Hidden>
            <Icon src="./icon.svg" alt="Application Icon" />
            <Typography variant="body1">Cruise</Typography>
            <WindowControl />
        </Root>
    );
}
