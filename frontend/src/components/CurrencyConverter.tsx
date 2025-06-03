'use client';

import { useState } from "react";
import { useExchangeRate } from "@/hooks/useExchangeRate";
import { useSimulateTransaction } from "@/hooks/useSimulateTransaction";

const CurrencyConverter = () => {
  const [amount, setAmount] = useState("");
  const [showResult, setShowResult] = useState(false);

  const { data: rateData, isLoading: rateLoading, isError: rateError } = useExchangeRate();
  const {
    mutate,
    data: transaction,
    isPending: converting,
    isError: conversionError,
    error: conversionErrorObj,
    reset,
  } = useSimulateTransaction();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    reset();
    setShowResult(false);
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return;
    mutate(Number(amount), {
      onSuccess: () => setShowResult(true),
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="max-w-md w-full p-6 border border-gray-200 rounded-lg shadow">
        <h1 className="text-xl font-bold mb-4 text-center">EUR to PLN Converter</h1>
        {rateLoading && <div className="mb-3 text-center">Loading rate...</div>}
        {rateError && <div className="mb-3 text-red-600 text-center">Failed to fetch rate</div>}
        {rateData && (
          <div className="mb-4 text-center">
            <div className="font-medium">1 EUR = {rateData.rate.toFixed(4)} PLN</div>
            <div className="text-xs text-gray-500">{new Date(rateData.timestamp).toLocaleString()}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <label htmlFor="amount" className="font-medium">Amount in EUR</label>
          <input
            id="amount"
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={handleChange}
            required
            className="px-3 py-2 text-base border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            disabled={converting || !amount || isNaN(Number(amount)) || Number(amount) <= 0}
            className="py-2 px-4 font-semibold rounded bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {converting ? "Converting..." : "Convert to PLN"}
          </button>
        </form>

        {conversionError && (
          <div className="text-red-600 mt-2 text-center">
            Conversion error: {conversionErrorObj?.message || "Try again"}
          </div>
        )}

        {showResult && transaction && (
          <div className="mt-4 p-3 border border-blue-200 rounded text-center">
            <div className="font-semibold">
              {transaction.eur.toFixed(2)} EUR = {transaction.pln.toFixed(2)} PLN
            </div>
            <div className="text-xs text-gray-600">
              Rate: {transaction.rate.toFixed(4)} • {new Date(transaction.timestamp).toLocaleString()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrencyConverter;
