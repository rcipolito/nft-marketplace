const DECIMALS = 18;
const BASE = 10n ** 18n;

export function ethToWei(eth: string): bigint {
    const [integer, decimal = ""] = eth.split(".");

    if (
        !/^\d+$/.test(integer) ||
        !/^\d*$/.test(decimal) ||
        decimal.length > DECIMALS
    ) {
        throw new Error("Valor de ETH inválido");
    }

    const paddedDecimal = decimal.padEnd(DECIMALS, "0");

    return BigInt(integer) * BASE + BigInt(paddedDecimal);
}

export function weiToEth(wei: bigint): string {
    const integer = wei / BASE;
    const decimal = (wei % BASE)
        .toString()
        .padStart(DECIMALS, "0")
        .replace(/0+$/, "");

    return decimal ? `${integer}.${decimal}` : integer.toString();
}