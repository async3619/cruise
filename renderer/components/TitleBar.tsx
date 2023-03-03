import React from "react";
import { useNavigate } from "react-router-dom";

import { Typography } from "@mui/material";
import { ArrowLeft20Regular } from "@fluentui/react-icons";

import WindowControl from "@components/WindowControl";
import { BackButton, Icon, Root } from "@components/TitleBar.styles";

import useHistoryStack from "@utils/useHistoryStack";

export default function TitleBar() {
    const navigate = useNavigate();
    const historyStack = useHistoryStack();

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <Root data-tauri-drag-region>
            <BackButton onClick={handleBack} disabled={!historyStack.length}>
                <ArrowLeft20Regular />
            </BackButton>
            <Icon src="/icon.svg" alt="Application Icon" />
            <Typography variant="body1">Cruise</Typography>
            <WindowControl />
        </Root>
    );
}
