"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowRightLeft,
  Coins,
  TrendingUp,
  AlertCircle,
  Loader2,
  CheckCircle2,
  RefreshCcw,
  Zap,
} from "lucide-react";
import confetti from "canvas-confetti";
import { fetchExchangeRate, fetchGoldPrice, fetchCurrencies } from "@/lib/api";

export default function Converter() {
  const [amount, setAmount] = useState<string>("");
  const [currency, setCurrency] = useState<string>("EUR");
  const [currencies, setCurrencies] = useState<
    { code: string; name: string }[]
  >([]);
  const [usdAmount, setUsdAmount] = useState<number | null>(null);
  const [goldWeightGrams, setGoldWeightGrams] = useState<number | null>(null);

  const [loadingConversion, setLoadingConversion] = useState(false);
  const [loadingGold, setLoadingGold] = useState(false);
  const [loadingCurrencies, setLoadingCurrencies] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const list = await fetchCurrencies();
        setCurrencies(list);
      } catch (err) {
        console.error("Failed to load currencies");
      } finally {
        setLoadingCurrencies(false);
      }
    };
    load();
  }, []);

  // Invalidate previous results when inputs change
  useEffect(() => {
    setUsdAmount(null);
    setGoldWeightGrams(null);
    setError(null);
  }, [amount, currency]);

  const handleConvert = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount greater than zero.");
      return;
    }

    setLoadingConversion(true);
    setError(null);
    setUsdAmount(null);
    setGoldWeightGrams(null);

    try {
      const rate = await fetchExchangeRate(currency, "USD");
      const converted = parseFloat(amount) * rate;
      setUsdAmount(converted);
    } catch (err: any) {
      setError(err.message || "Failed to convert currency. Please try again.");
    } finally {
      setLoadingConversion(false);
    }
  };

  const handleCalculateGold = async () => {
    if (!usdAmount) return;

    setLoadingGold(true);
    setError(null);

    try {
      const pricePerOunce = await fetchGoldPrice();
      // 1 troy ounce = 31.1035 grams
      const pricePerGram = pricePerOunce / 31.1035;
      const weight = usdAmount / pricePerGram;
      setGoldWeightGrams(weight);

      // Trigger Celebration!
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) =>
        Math.random() * (max - min) + min;

      const interval: any = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        // since particles fall down, start a bit higher than random
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: ["#EAB308", "#FACC15", "#CA8A04"], // Gold shades
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ["#EAB308", "#FACC15", "#CA8A04"], // Gold shades
        });
      }, 250);
    } catch (err: any) {
      setError(err.message || "Failed to fetch gold price. Please try again.");
    } finally {
      setLoadingGold(false);
    }
  };

  const reset = () => {
    setAmount("");
    setUsdAmount(null);
    setGoldWeightGrams(null);
    setError(null);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-400 text-xs font-bold uppercase tracking-widest animate-bounce">
          <Zap size={14} fill="currentColor" /> Real-time Market Rates
        </div>
        <h1 className="text-5xl font-black tracking-tight sm:text-6xl">
          <span className="bg-gradient-to-r from-zinc-900 to-zinc-500 dark:from-white dark:to-zinc-500 bg-clip-text text-transparent">
            Currency to{" "}
          </span>
          <span className="bg-gradient-to-r from-yellow-600 to-amber-400 bg-clip-text text-transparent">
            Gold
          </span>
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-lg max-w-lg mx-auto leading-relaxed">
          Convert your local currency into USD and instantly discover its
          equivalent weight in physical gold.
        </p>
      </div>

      {/* Main Container - Side by Side Grid */}
      <div className="grid md:grid-cols-2 gap-8 items-stretch">
        {/* Step 1: Currency Conversion */}
        <section className="relative group flex flex-col h-full rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl shadow-2xl transition-all hover:border-blue-500/30 overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity -rotate-12 translate-x-4 -translate-y-4">
            <ArrowRightLeft size={160} />
          </div>

          <div className="p-10 flex flex-col h-full space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  <ArrowRightLeft size={24} />
                </div>
                <div>
                  <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-blue-500/60 leading-none mb-1">
                    Phase 01
                  </span>
                  <h2 className="text-2xl font-black text-zinc-900 dark:text-white">
                    Conversion
                  </h2>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 ml-1">
                  Input Asset
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    disabled={loadingCurrencies}
                    className="col-span-1 h-14 px-4 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-bold outline-none focus:ring-2 focus:ring-blue-500/50 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {loadingCurrencies ? (
                      <option>...</option>
                    ) : (
                      currencies.map((c: { code: string; name: string }) => (
                        <option key={c.code} value={c.code}>
                          {c.code}
                        </option>
                      ))
                    )}
                  </select>
                  <div
                    className={`col-span-2 relative transition-all duration-300 ${
                      error ? "ring-2 ring-red-500/50 rounded-2xl" : ""
                    }`}
                  >
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Enter amount"
                      disabled={loadingConversion}
                      className={`w-full h-14 pl-5 pr-12 rounded-2xl border ${
                        error
                          ? "border-red-500 dark:border-red-500"
                          : "border-zinc-200 dark:border-zinc-700"
                      } bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-bold outline-none focus:ring-2 focus:ring-blue-500/50 transition-all`}
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-300 font-black text-xs">
                      {currency}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 animate-in slide-in-from-top-2 duration-300">
                <AlertCircle size={18} strokeWidth={3} />
                <p className="text-[11px] font-black uppercase tracking-tight">
                  {error}
                </p>
              </div>
            )}

            <button
              onClick={handleConvert}
              disabled={loadingConversion || !amount}
              className="group relative w-full h-16 overflow-hidden rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-black transition-all active:scale-[0.98] disabled:opacity-50"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 via-blue-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative flex items-center justify-center gap-3 tracking-wide">
                {loadingConversion ? (
                  <Loader2 className="animate-spin" size={22} />
                ) : (
                  <TrendingUp size={22} />
                )}
                {loadingConversion ? "FETCHING RATES..." : "CONVERT TO USD"}
              </span>
            </button>

            <div className="mt-auto pt-6 border-t border-zinc-100 dark:border-zinc-800">
              {usdAmount !== null ? (
                <div className="animate-in slide-in-from-top-4 duration-500 p-6 rounded-3xl bg-blue-500/5 dark:bg-blue-400/5 border border-blue-500/10 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-blue-500/60 mb-1">
                      Calculated Value
                    </p>
                    <p className="text-4xl font-black text-blue-600 dark:text-blue-400 tracking-tight">
                      $
                      {usdAmount.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                  <div className="h-14 w-14 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-500">
                    <CheckCircle2 size={28} />
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-3xl">
                  <p className="text-zinc-400 text-sm font-medium italic">
                    Pending conversion...
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Step 2: Gold Reward */}
        <section
          className={`relative group flex flex-col h-full rounded-[2.5rem] border transition-all duration-700 overflow-hidden ${
            usdAmount
              ? "border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl shadow-2xl scale-100"
              : "border-zinc-100 dark:border-zinc-900 bg-zinc-50/30 dark:bg-zinc-950/20 opacity-40 scale-[0.98] blur-[1px]"
          }`}
        >
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity rotate-12 translate-x-4 -translate-y-4">
            <Coins size={160} />
          </div>

          <div className="p-10 flex flex-col h-full space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl border transition-all ${
                    usdAmount
                      ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 border-zinc-200 dark:border-zinc-700"
                  }`}
                >
                  <Coins size={24} />
                </div>
                <div>
                  <span
                    className={`block text-[10px] font-black uppercase tracking-[0.2em] leading-none mb-1 ${
                      usdAmount ? "text-yellow-500/60" : "text-zinc-400"
                    }`}
                  >
                    Phase 02
                  </span>
                  <h2
                    className={`text-2xl font-black ${
                      usdAmount
                        ? "text-zinc-900 dark:text-white"
                        : "text-zinc-400"
                    }`}
                  >
                    Gold Reward
                  </h2>
                </div>
              </div>
            </div>

            {!usdAmount ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="p-5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-300">
                  <Zap size={32} />
                </div>
                <p className="text-sm font-bold text-zinc-400 max-w-[200px] uppercase tracking-tighter">
                  Unlock this phase by converting your currency
                </p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col space-y-8 animate-in fade-in zoom-in-95 duration-500">
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                  At the current spot price, your{" "}
                  <span className="text-zinc-900 dark:text-white font-black decoration-blue-500 decoration-2 underline-offset-4 underline">
                    ${usdAmount.toFixed(2)}
                  </span>{" "}
                  can be minted into exactly:
                </p>

                <button
                  onClick={handleCalculateGold}
                  disabled={loadingGold}
                  className="group relative w-full h-16 overflow-hidden rounded-2xl bg-yellow-500 text-white font-black transition-all active:scale-[0.98] shadow-[0_0_30px_-10px_rgba(234,179,8,0.5)]"
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-yellow-600 via-amber-500 to-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative flex items-center justify-center gap-3 tracking-wide">
                    {loadingGold ? (
                      <Loader2 className="animate-spin" size={22} />
                    ) : (
                      <Zap size={22} />
                    )}
                    {loadingGold ? "MINTING DATA..." : "CALCULATE REWARD"}
                  </span>
                </button>

                <div className="mt-auto">
                  {goldWeightGrams !== null ? (
                    <div className="animate-in slide-in-from-bottom-4 duration-700 p-8 rounded-[2rem] bg-gradient-to-br from-yellow-500 via-amber-600 to-yellow-700 text-white shadow-2xl shadow-yellow-500/20 relative overflow-hidden group">
                      <div className="absolute -right-6 -bottom-6 opacity-20 rotate-12 transition-transform group-hover:scale-110 duration-1000">
                        <Coins size={160} />
                      </div>
                      <div className="relative">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mb-2">
                          Metal Weight
                        </p>
                        <div className="flex items-baseline gap-3">
                          <span className="text-6xl font-black tracking-tighter">
                            {goldWeightGrams.toLocaleString(undefined, {
                              maximumFractionDigits: 4,
                            })}
                          </span>
                          <span className="text-2xl font-black opacity-90 tracking-widest uppercase">
                            g
                          </span>
                        </div>
                        <div className="mt-6 flex items-center gap-2 text-[10px] font-black opacity-60 uppercase tracking-widest">
                          <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
                          Verified Market Price
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="py-10 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl">
                      <p className="text-zinc-400 text-xs font-black uppercase tracking-widest">
                        Ready for calculation
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Extra Actions */}
      <div className="max-w-md mx-auto">
        {(usdAmount || goldWeightGrams) && (
          <div className="flex justify-center">
            <button
              onClick={reset}
              className="group flex items-center gap-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all text-xs font-black uppercase tracking-[0.2em] py-3 px-6 rounded-2xl border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 hover:bg-white dark:hover:bg-zinc-900"
            >
              <RefreshCcw
                size={14}
                className="group-hover:rotate-180 transition-transform duration-500"
              />
              Reset All Data
            </button>
          </div>
        )}
      </div>

      <footer className="text-center pt-8 border-t border-zinc-100 dark:border-zinc-800">
        <p className="text-[10px] text-zinc-400 font-black uppercase tracking-[0.3em] opacity-40">
          Developed by Falak Ahmad • Market Infrastructure by ExchangeRate-API &
          Binance
        </p>
      </footer>
    </div>
  );
}
