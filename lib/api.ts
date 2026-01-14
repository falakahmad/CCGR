export const CURRENCY_API_BASE = "https://open.er-api.com/v6/latest";
export const GOLD_API_URL =
  "https://api.binance.com/api/v3/ticker/price?symbol=PAXGUSDT";
export const CURRENCY_NAMES_URL =
  "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json";

export async function fetchExchangeRate(from: string, to: string = "USD") {
  if (from === to) return 1;
  const res = await fetch(`${CURRENCY_API_BASE}/${from}`);
  if (!res.ok) throw new Error("Failed to fetch currency rate");
  const data = await res.json();
  if (data.result === "error")
    throw new Error(data["error-type"] || "Invalid currency");
  return data.rates[to];
}

export async function fetchGoldPrice() {
  const res = await fetch(GOLD_API_URL);
  if (!res.ok) throw new Error("Failed to fetch gold price");
  const data = await res.json();
  return parseFloat(data.price);
}

export async function fetchCurrencies() {
  try {
    // 1. Fetch names
    const namesRes = await fetch(CURRENCY_NAMES_URL);
    if (!namesRes.ok) throw new Error("Failed to fetch currency names");
    const namesData = await namesRes.json();

    // 2. Fetch supported codes from the exchange rate API
    const ratesRes = await fetch(`${CURRENCY_API_BASE}/USD`);
    if (!ratesRes.ok) throw new Error("Failed to fetch supported codes");
    const ratesData = await ratesRes.json();
    const supportedCodes = Object.keys(ratesData.rates);

    // 3. Intersect and transform
    return supportedCodes
      .map((code) => {
        const lowerCode = code.toLowerCase();
        return {
          code: code.toUpperCase(),
          name: namesData[lowerCode] || code.toUpperCase(),
        };
      })
      .filter((c) => c.name.trim() !== "")
      .sort((a, b) => a.code.localeCompare(b.code));
  } catch (error) {
    console.error("Error fetching currencies, using fallback:", error);
    return CURRENCIES_FALLBACK;
  }
}

export const CURRENCIES_FALLBACK = [
  { code: "USD", name: "United States Dollar" },
  { code: "EUR", name: "Euro" },
  { code: "GBP", name: "British Pound" },
  { code: "INR", name: "Indian Rupee" },
  { code: "AUD", name: "Australian Dollar" },
  { code: "CAD", name: "Canadian Dollar" },
  { code: "JPY", name: "Japanese Yen" },
  { code: "CNY", name: "Chinese Yuan" },
  { code: "AED", name: "UAE Dirham" },
  { code: "SAR", name: "Saudi Riyal" },
  { code: "PKR", name: "Pakistani Rupee" },
];
