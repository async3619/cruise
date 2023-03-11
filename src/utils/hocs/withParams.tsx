import React from "react";
import { Diff } from "utility-types";
import { useParams } from "react-router-dom";

export interface WithParamsProps<TParams extends Record<string, string>> {
    params: Partial<TParams>;
}

const withParams = <BaseProps extends WithParamsProps<any>>(BaseComponent: React.ComponentType<BaseProps>) => {
    type HocProps = Diff<BaseProps, WithParamsProps<any>>;

    function Hoc({ ...restProps }: HocProps) {
        const params = useParams();

        return <BaseComponent {...(restProps as BaseProps)} params={params} />;
    }

    Hoc.displayName = `WithParams(${BaseComponent.name})`;
    Hoc.WrappedComponent = BaseComponent;

    return Hoc;
};

export default withParams;
