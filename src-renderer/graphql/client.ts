import { ApolloClient, InMemoryCache } from "@apollo/client";
import { ApolloLink } from "@apollo/client/core";
import { onError } from "@apollo/client/link/error";
import { createIpcLink } from "@graphql/ipc-link";

import apolloLogger from "apollo-link-logger";

const apolloClient = new ApolloClient({
    defaultOptions: {
        query: {
            fetchPolicy: "no-cache",
        },
        mutate: {
            fetchPolicy: "no-cache",
        },
        watchQuery: {
            fetchPolicy: "no-cache",
        },
    },
    cache: new InMemoryCache(),
    link: ApolloLink.from([
        apolloLogger,
        onError(({ graphQLErrors, networkError }) => {
            if (graphQLErrors)
                graphQLErrors.forEach(({ message, locations, path }) =>
                    console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`),
                );
            if (networkError) console.error(`[Network error]: ${networkError}. Backend is unreachable. Is it running?`);
        }),
        createIpcLink({ ipc: window.ipcRenderer }),
    ]),
});

export default apolloClient;
