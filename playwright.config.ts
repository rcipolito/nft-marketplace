import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
    testDir: "./tests",

    fullyParallel: true,

    retries: 0,

    reporter: "html",

    use: {
        baseURL: "http://localhost:5173",
        trace: "on-first-retry",
    },

    projects: [
        {
            name: "chrome",
            use: {
                ...devices["Desktop Chrome"],
                channel: "chrome",
            },
        },
    ],

    webServer: {
        command: "pnpm dev:all",
        url: "http://localhost:5173",
        reuseExistingServer: !process.env.CI,
        timeout: 30000,
    },
});