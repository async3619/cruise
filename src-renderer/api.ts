import { createTRPCProxyClient } from "@trpc/client";
import { ipcLink } from "electron-trpc/renderer";
import { AppRouter } from "@main/api";
import { createTRPCReact } from "@trpc/react-query";

export const client = createTRPCProxyClient<AppRouter>({
    links: [ipcLink()],
});

export const trpcReact = createTRPCReact<AppRouter>();
