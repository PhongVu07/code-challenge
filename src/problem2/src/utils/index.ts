import type { Token } from "../types";

export const processTokenData = (data: { currency: string; price: number }[]): Token[] => {
    const tokenMap = new Map<string, Token>();
    data.forEach(item => {
        if (item.price) {
            tokenMap.set(item.currency, {
                currency: item.currency,
                price: item.price,
                icon: `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${item.currency}.svg`,
            });
        }
    });
    return Array.from(tokenMap.values());
};
