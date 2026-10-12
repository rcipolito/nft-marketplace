import { test, expect } from "@playwright/test";

test("deve realizar login e acessar o perfil", async ({ page }) => {
    await page.goto("/login");

    await page.getByLabel("E-mail", { exact: true }).fill("teste@nft.com");
    await page.getByLabel("Senha").fill("123456");

    await page.getByRole("button", {
        name: "Entrar",
    }).click();

    await page.goto("/profile");

    await expect(
        page.getByText("teste@nft.com")
    ).toBeVisible();
});

test("deve impedir acesso ao perfil sem login", async ({ page }) => {
    await page.goto("/profile");

    await expect(page).toHaveURL(/\/login$/);
});