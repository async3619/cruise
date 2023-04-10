import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { Router } from "@async3619/haunted";

import { DynamicModule, Module, Provider } from "@nestjs/common";

import { HAUNTED_CLIENT } from "@main/haunted/haunted.decorator";

interface HauntedOption {
    url: string;
}

export type HauntedClient = () => ReturnType<typeof createTRPCProxyClient<Router>>;

@Module({})
export class HauntedModule {
    public static forRoot(options: HauntedOption): DynamicModule {
        const client = createTRPCProxyClient<Router>({
            links: [httpBatchLink({ url: options.url })],
        });

        const clientProvider: Provider = {
            provide: HAUNTED_CLIENT,
            useValue: () => client,
        };

        return {
            module: HauntedModule,
            providers: [clientProvider],
            exports: [clientProvider],
            global: true,
        };
    }
}
