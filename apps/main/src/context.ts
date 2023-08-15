import { BrowserWindow } from "electron";

import { BaseContext } from "@apollo/server";

export interface GraphQLContext extends BaseContext {
    window: BrowserWindow | null;
}

export async function createGraphQLContext(
    window: Electron.CrossProcessExports.BrowserWindow | null,
): Promise<GraphQLContext> {
    return { window };
}
