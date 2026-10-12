import { test, expect } from "@playwright/test";

test("deve exibir o catálogo de NFTs", async ({ page }) => {
    await page.goto("/");

    await expect(
        page.getByText("Emerald Ape #042")
    ).toBeVisible();

    await expect(
        page.getByText("Sage Nomad #009")
    ).toBeVisible();

    await expect(
        page.getByText("Neon Vessel #552")
    ).toBeVisible();

    await expect(
        page.getByText("Cosmic Bloom #118")
    ).toBeVisible();

    await expect(
        page.getByText("Violet Nomad #314")
    ).toBeVisible();

    await expect(
        page.getByText("Ivory Baron #088")
    ).toBeVisible();

    await expect(
        page.getByText("Golden Beat #207")
    ).toBeVisible();

    await expect(
        page.getByText("Golden Signal #160")
    ).toBeVisible();
});

test("deve abrir os detalhes de um NFT", async ({ page }) => {
    await page.goto("/");

    await page.getByText("Emerald Ape #042").click();

    await expect(page).toHaveURL(/\/nft\/1$/);

    await expect(
        page.getByText("Emerald Ape #042")
    ).toBeVisible();
});