import { test, expect } from "@playwright/test";

test("deve adicionar um NFT ao carrinho", async ({ page }) => {
    await page.goto("/nft/1");

    await page.getByRole("button", {
        name: "Adicionar ao carrinho",
    }).click();

    await page.goto("/cart");

    await expect(
        page.getByText("Emerald Ape #042")
    ).toBeVisible();
});

test("deve manter o carrinho após atualizar a página", async ({ page }) => {
    await page.goto("/nft/1");

    await page.getByRole("button", {
        name: "Adicionar ao carrinho",
    }).click();

    await page.goto("/cart");

    await page.reload();

    await expect(
        page.getByText("Emerald Ape #042")
    ).toBeVisible();
});