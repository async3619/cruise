declare module "apollo-link-logger" {
    import { ApolloLink } from "@apollo/client/core";
    declare const apolloLogger: ApolloLink;

    export = apolloLogger;
}
