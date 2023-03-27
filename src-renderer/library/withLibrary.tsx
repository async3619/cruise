import React from "react";
import { Diff } from "utility-types";

import useLibrary from "@library/useLibrary";
import { LibraryContextValue } from "@library/context";

export interface WithLibraryProps {
    library: LibraryContextValue;
}

const withLibrary = <BaseProps extends WithLibraryProps>(BaseComponent: React.ComponentType<BaseProps>) => {
    type HocProps = Diff<BaseProps, WithLibraryProps>;

    function Hoc({ ...restProps }: HocProps) {
        const library = useLibrary();

        return <BaseComponent {...(restProps as BaseProps)} library={library} />;
    }

    Hoc.displayName = `WithLibrary(${BaseComponent.name})`;
    Hoc.WrappedComponent = BaseComponent;

    return Hoc;
};

export default withLibrary;
