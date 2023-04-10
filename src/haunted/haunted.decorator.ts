import { Inject } from "@nestjs/common";

export const HAUNTED_CLIENT = "HAUNTED_CLIENT";

export function InjectHauntedClient() {
    return Inject(HAUNTED_CLIENT);
}
