import { BrowserWindow } from "electron";

import { initTRPC } from "@trpc/server";
import { observable } from "@trpc/server/observable";

import { Config, CONFIG_SCHEMA, getConfig, setConfig } from "./config";

interface Context {
    window: BrowserWindow | null;
}

const t = initTRPC.context<Context>().create({ isServer: true });

export const router = t.router({
    maximize: t.procedure.query(({ ctx }) => {
        ctx.window?.maximize();
    }),

    unmaximize: t.procedure.query(({ ctx }) => {
        ctx.window?.unmaximize();
    }),

    minimize: t.procedure.query(({ ctx }) => {
        ctx.window?.minimize();
    }),

    close: t.procedure.query(({ ctx }) => {
        ctx.window?.close();
    }),

    getConfig: t.procedure.query<Config>(async () => {
        return getConfig();
    }),

    setConfig: t.procedure.input(CONFIG_SCHEMA).mutation(async ({ input: config }) => {
        return setConfig(config);
    }),

    onMaximizedStateChange: t.procedure.subscription(({ ctx }) => {
        return observable<boolean>(emit => {
            const onChanged = (data: boolean) => {
                // emit data to client
                emit.next(data);
            };

            const onMaximize = () => onChanged(true);
            const onUnmaximize = () => onChanged(false);

            if (ctx.window) {
                ctx.window.on("maximize", onMaximize);
                ctx.window.on("unmaximize", onUnmaximize);
            }

            return () => {
                if (ctx.window) {
                    ctx.window.off("maximize", onMaximize);
                    ctx.window.off("unmaximize", onUnmaximize);
                }
            };
        });
    }),
});

export type AppRouter = typeof router;
