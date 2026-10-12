import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";
import { orderHandlers } from "./order-handlers";
import { authHandlers } from "./auth-handlers";
import { walletHandlers } from "./wallet-handlers";

export const worker = setupWorker(
    ...handlers,
    ...orderHandlers,
    ...authHandlers,
    ...walletHandlers
);