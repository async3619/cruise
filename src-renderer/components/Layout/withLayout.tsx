import React from "react";
import { Diff } from "utility-types";

import { useLayout } from "@components/Layout";

// These props will be injected into the base component
export interface WithLayoutProps {
    scrollView: HTMLDivElement | null;
}

export const withLayout = <BaseProps extends WithLayoutProps>(BaseComponent: React.ComponentType<BaseProps>) => {
    type HocProps = Diff<BaseProps, WithLayoutProps>;

    function Hoc({ ...restProps }: HocProps) {
        const { scrollView } = useLayout();

        return <BaseComponent {...(restProps as BaseProps)} scrollView={scrollView} />;
    }

    Hoc.displayName = `WithLayout(${BaseComponent.name})`;
    Hoc.WrappedComponent = BaseComponent;

    return Hoc;
};
