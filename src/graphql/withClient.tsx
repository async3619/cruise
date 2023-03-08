import React from "react";
import { Diff } from "utility-types";

import { ApolloClient, useApolloClient } from "@apollo/client";

export interface WithClientProps {
    client: ApolloClient<object>;
}

const withClient = <BaseProps extends WithClientProps>(BaseComponent: React.ComponentType<BaseProps>) => {
    type HocProps = Diff<BaseProps, WithClientProps>;

    function Hoc({ ...restProps }: HocProps) {
        const client = useApolloClient();

        return <BaseComponent {...(restProps as BaseProps)} client={client} />;
    }

    Hoc.displayName = `WithClient(${BaseComponent.name})`;
    Hoc.WrappedComponent = BaseComponent;

    return Hoc;
};

export default withClient;
