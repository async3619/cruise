import React from "react";
import { Diff } from "utility-types";

import { LayoutContextValues, useLayout } from "@components/Layout/context";

// These props will be injected into the base component
export interface WithLayoutProps extends LayoutContextValues {}

export const withLayout = <BaseProps extends WithLayoutProps>(BaseComponent: React.ComponentType<BaseProps>) => {
    type HocProps = Diff<BaseProps, WithLayoutProps>;

    function Hoc({ ...restProps }: HocProps) {
        return <BaseComponent {...(restProps as BaseProps)} {...useLayout()} />;
    }

    Hoc.displayName = `WithLayout(${BaseComponent.name})`;
    Hoc.WrappedComponent = BaseComponent;

    return Hoc;
};
