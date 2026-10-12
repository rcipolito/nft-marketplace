import { test, expect } from "@playwright/test";

test("deve finalizar uma compra e confirmar o pedido", async ({ page }) => {
    // 1. Acessar os detalhes do NFT
    await page.goto("/nft/1");

    // 2. Adicionar ao carrinho
    await page.getByRole("button", {
        name: "Adicionar ao carrinho",
    }).click();

    // 3. Abrir o carrinho
    await page.goto("/cart");

    await expect(
        page.getByText("Emerald Ape #042")
    ).toBeVisible();

    // 4. Acessar o checkout
    await page.goto("/checkout");

    // 5. Confirmar a compra
    await page.getByRole("button", {
        name: "Confirmar compra",
    }).click();

    // 6. Verificar o redirecionamento
    await expect(page).toHaveURL(/\/order\/[^/]+$/);

    // 7. Verificar os dados do pedido
    await expect(
        page.getByText("Emerald Ape #042")
    ).toBeVisible();

    // 8. Aguardar a confirmação pelo Socket.IO
    await expect(
        page.getByText("Compra confirmada", { exact: true })
    ).toBeVisible({ timeout: 15000 });
});