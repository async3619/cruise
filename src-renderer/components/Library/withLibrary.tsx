import React from "react";
import { Diff } from "utility-types";

import { Library } from "@components/Library";
import { useLibrary } from "@components/Library/Provider";

// These props will be injected into the base component
export interface WithLibraryProps {
    library: Library;
}

export const withLibrary = <BaseProps extends WithLibraryProps>(BaseComponent: React.ComponentType<BaseProps>) => {
    type HocProps = Diff<BaseProps, WithLibraryProps>;

    function Hoc({ ...restProps }: HocProps) {
        const library = useLibrary();

        return <BaseComponent {...(restProps as BaseProps)} library={library} />;
    }

    Hoc.displayName = `WithLibrary(${BaseComponent.name})`;
    Hoc.WrappedComponent = BaseComponent;

    return Hoc;
};
