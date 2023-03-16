import React from "react";
import { Diff } from "utility-types";

import { DialogContextValue } from "@dialogs";
import useDialog from "@dialogs/useDialog";

export interface WithDialogProps extends DialogContextValue {}

const withDialog = <BaseProps extends WithDialogProps>(BaseComponent: React.ComponentType<BaseProps>) => {
    type HocProps = Diff<BaseProps, WithDialogProps>;

    function Hoc({ ...restProps }: HocProps) {
        const dialog = useDialog();

        return <BaseComponent {...(restProps as BaseProps)} {...dialog} />;
    }

    Hoc.displayName = `WithDialog(${BaseComponent.name})`;
    Hoc.WrappedComponent = BaseComponent;

    return Hoc;
};

export default withDialog;
