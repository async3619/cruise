import React from "react";
import { Diff } from "utility-types";

import { ConfigContextValue, useConfig } from "@components/Config/Provider";

// These props will be injected into the base component
export interface WithConfigProps extends ConfigContextValue {}

export const withConfig = <BaseProps extends WithConfigProps>(BaseComponent: React.ComponentType<BaseProps>) => {
    type HocProps = Diff<BaseProps, WithConfigProps>;

    function Hoc({ ...restProps }: HocProps) {
        const config = useConfig();

        return <BaseComponent {...(restProps as BaseProps)} {...config} />;
    }

    Hoc.displayName = `WithConfig(${BaseComponent.name})`;
    Hoc.WrappedComponent = BaseComponent;

    return Hoc;
};
