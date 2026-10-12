import {
    createRootRoute,
    createRoute,
    createRouter,
    Outlet,
} from "@tanstack/react-router";
import Header from "@/components/layout/header";
import Home from "./home";
import Footer from "@/components/layout/footer";
import NftDetail from "./nft-detail";
import Cart from "./cart";
import Checkout from "./checkout";
import OrderConfirmation from "./order-confirmation";
import Login from "./login";
import Register from "./register";
import Profile from "./profile";
import Wallets from "./wallets";

import { redirect } from "@tanstack/react-router";
import { getValidSession } from "@/utils/session";
import type { NftFilters } from "@/services/nfts";

const rootRoute = createRootRoute({
    component: () => (
        <div className="flex min-h-screen flex-col">
            <Header />

            <div className="flex-1">
                <Outlet />
            </div>

            <Footer />
        </div>
    ),
});

const homeRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    validateSearch: (
        search: Record<string, unknown>
    ): NftFilters => ({
        search:
            typeof search.search === "string"
                ? search.search
                : "",

        sort:
            search.sort === "price_asc" ||
                search.sort === "price_desc"
                ? search.sort
                : "recent",

        page:
            typeof search.page === "number" &&
                Number.isInteger(search.page) &&
                search.page > 0
                ? search.page
                : 1,
                
        maxPrice:
            typeof search.maxPrice === "number" &&
                Number.isFinite(search.maxPrice) &&
                search.maxPrice >= 0 &&
                search.maxPrice <= 12.3
                ? search.maxPrice
                : 12.3,
    }),
    component: Home,
});

const cartRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/cart",
    component: Cart,
});

const checkoutRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/checkout",
    component: Checkout,
});

const orderRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/order/$orderId",
    component: OrderConfirmation,
});

const loginRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/login",
    component: Login,
});

const nftRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/nft/$nftId",
    component: NftDetail,
});

const registerRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/register",
    component: Register,
});

const profileRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/profile",

    beforeLoad: () => {
        const session = getValidSession();

        if (!session) {
            throw redirect({
                to: "/login",
            });
        }
    },

    component: Profile,
});

const walletsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/wallets",

    beforeLoad: () => {
        if (!getValidSession()) {
            throw redirect({ to: "/login" });
        }
    },

    component: Wallets,
});

const routeTree = rootRoute.addChildren([
    homeRoute,
    nftRoute,
    cartRoute,
    checkoutRoute,
    orderRoute,
    loginRoute,
    registerRoute,
    profileRoute,
    walletsRoute
]);

export const router = createRouter({
    routeTree,
});

declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}