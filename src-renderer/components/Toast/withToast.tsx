import React from "react";
import { Diff } from "utility-types";

import { useToast } from "@components/Toast/Provider";
import { ToastContextValues } from "@components/Toast/types";

// These props will be injected into the base component
export interface WithToastProps {
    toast: ToastContextValues;
}

export const withToast = <BaseProps extends WithToastProps>(BaseComponent: React.ComponentType<BaseProps>) => {
    type HocProps = Diff<BaseProps, WithToastProps>;

    function Hoc({ ...restProps }: HocProps) {
        const toast = useToast();

        return <BaseComponent {...(restProps as BaseProps)} toast={toast} />;
    }

    Hoc.displayName = `WithToast(${BaseComponent.name})`;
    Hoc.WrappedComponent = BaseComponent;

    return Hoc;
};
