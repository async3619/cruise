import { RepeatMode } from "@player/context";

import { SvgIcon } from "@mui/material";
import RepeatRoundedIcon from "@mui/icons-material/RepeatRounded";
import RepeatOneRoundedIcon from "@mui/icons-material/RepeatOneRounded";

export const REPEAT_MODES: RepeatMode[] = [RepeatMode.None, RepeatMode.All, RepeatMode.One];
export const REPEAT_MODE_NAMES: Record<RepeatMode, string> = {
    [RepeatMode.None]: "Repeat Off",
    [RepeatMode.All]: "Repeat All",
    [RepeatMode.One]: "Repeat One",
};
export const REPEAT_MODE_ICONS: Record<RepeatMode, typeof SvgIcon> = {
    [RepeatMode.None]: RepeatRoundedIcon,
    [RepeatMode.All]: RepeatRoundedIcon,
    [RepeatMode.One]: RepeatOneRoundedIcon,
};
