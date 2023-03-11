import React from "react";
import { Diff } from "utility-types";
import { useNavigate, useParams } from "react-router-dom";

export interface WithParamsProps<TParams extends Record<string, string>> {
    params: Partial<TParams>;
    navigate: ReturnType<typeof useNavigate>;
}

const withParams = <BaseProps extends WithParamsProps<any>>(BaseComponent: React.ComponentType<BaseProps>) => {
    type HocProps = Diff<BaseProps, WithParamsProps<any>>;

    function Hoc({ ...restProps }: HocProps) {
        const params = useParams();
        const navigate = useNavigate();

        return <BaseComponent {...(restProps as BaseProps)} params={params} navigate={navigate} />;
    }

    Hoc.displayName = `WithParams(${BaseComponent.name})`;
    Hoc.WrappedComponent = BaseComponent;

    return Hoc;
};

export default withParams;
