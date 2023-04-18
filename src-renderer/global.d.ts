declare module "apollo-link-logger" {
    import { ApolloLink } from "@apollo/client/core";
    declare const apolloLogger: ApolloLink;

    export = apolloLogger;
}

declare module "*.svg" {
    const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;

    export default ReactComponent;
}
