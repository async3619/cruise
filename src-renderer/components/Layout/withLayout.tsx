import React from "react";
import { Diff } from "utility-types";

import { useLayout } from "@components/Layout/useLayout";
import { LayoutContextValue } from "@components/Layout/context";

export interface WithLayoutProps {
    layout: LayoutContextValue;
}

const withLayout = <BaseProps extends WithLayoutProps>(BaseComponent: React.ComponentType<BaseProps>) => {
    type HocProps = Diff<BaseProps, WithLayoutProps>;

    function Hoc({ ...restProps }: HocProps) {
        const layout = useLayout();

        return <BaseComponent {...(restProps as BaseProps)} layout={layout} />;
    }

    Hoc.displayName = `WithLayout(${BaseComponent.name})`;
    Hoc.WrappedComponent = BaseComponent;

    return Hoc;
};

export default withLayout;
