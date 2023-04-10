import { createTRPCReact } from "@trpc/react-query";
import type { Router } from "@async3619/haunted";

export const haunted = createTRPCReact<Router>();
