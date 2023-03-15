import React from "react";

import { DialogContext } from "@dialogs";

export default function useDialog() {
    return React.useContext(DialogContext);
}
