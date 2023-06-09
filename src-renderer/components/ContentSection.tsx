import React from "react";
import { useTranslation } from "react-i18next";

import { Box, Button, Typography } from "@mui/material";

import { Root } from "@components/ContentSection.styles";

export interface ContentSectionProps {
    title?: string;
    children?: React.ReactNode;
    onMoreClick?(): void;
}

export function ContentSection({ title, children, onMoreClick }: ContentSectionProps) {
    const { t } = useTranslation();

    return (
        <Root>
            <Box height={32} mb={2} display="flex" alignItems="center">
                <Typography variant="h3" fontSize="1.5rem" lineHeight={1} fontWeight={400}>
                    {title}
                </Typography>
                <Box flex="1 1 auto" />
                {!!onMoreClick && (
                    <Button variant="text" size="small" onClick={onMoreClick}>
                        {t("common.more")}
                    </Button>
                )}
            </Box>
            {children}
        </Root>
    );
}
