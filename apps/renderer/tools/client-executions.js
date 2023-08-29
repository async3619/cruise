// eslint-disable-next-line @typescript-eslint/no-var-requires
const { pascalCase } = require("change-case");

module.exports = {
    plugin(schema, documents) {
        let results = [];
        for (const { document } of documents) {
            for (const definition of document.definitions) {
                if (definition.kind !== "OperationDefinition") {
                    continue;
                }

                if (definition.operation === "query") {
                    const { name } = definition;
                    const queryName = pascalCase(name.value);
                    const result = `
export function query${queryName}(client: Apollo.ApolloClient<object>, options?: Omit<Apollo.QueryOptions<${queryName}QueryVariables, ${queryName}Query>, "query">) {
    return client.query<${queryName}Query, ${queryName}QueryVariables>({
        query: ${queryName}Document,
        ...options,
    });
}
                `.trim();

                    results.push(result);
                } else if (definition.operation === "mutation") {
                    const { name } = definition;
                    const mutationName = pascalCase(name.value);
                    const result = `
export function execute${mutationName}(client: Apollo.ApolloClient<object>, options?: Omit<Apollo.MutationOptions<${mutationName}Mutation, ${mutationName}MutationVariables>, "mutation">) {
    return client.mutate<${mutationName}Mutation, ${mutationName}MutationVariables>({
        mutation: ${mutationName}Document,
        ...options,
    });
}
                `.trim();

                    results.push(result);
                }
            }
        }

        return results.join("\n\n");
    },
};
