import { test, expect } from "@playwright/test";

test("deve cadastrar uma carteira e mantê-la após atualizar", async ({ page }) => {
    await page.goto("/login");

    await page.getByLabel("E-mail", { exact: true }).fill("teste@nft.com");
    await page.getByLabel("Senha").fill("123456");

    await page.getByRole("button", {
        name: "Entrar",
    }).click();

    await page.goto("/wallets");

    await page.getByLabel("Nome da carteira").fill("Minha carteira");

    await page.getByLabel("Endereço Ethereum").fill(
        "0x1234567890123456789012345678901234567890"
    );

    await page.getByRole("button", {
        name: "Adicionar carteira",
    }).click();

    await expect(
        page.getByText("Minha carteira")
    ).toBeVisible();

    await page.reload();

    await expect(
        page.getByText("Minha carteira")
    ).toBeVisible();
});