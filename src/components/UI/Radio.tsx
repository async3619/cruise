import React from "react";

import { RadioProps } from "@mui/material";

import { CheckedIcon, Icon, Root } from "@components/UI/Radio.styles";

export default function Radio(props: RadioProps) {
    return <Root disableRipple icon={<Icon />} checkedIcon={<CheckedIcon />} {...props} />;
}
