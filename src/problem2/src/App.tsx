import React, { useState, useEffect } from 'react';
import { ArrowDownIcon } from './assets/Icons';
import CurrencyInput from './components/CurrencyInput';
import TokenSelectModal from './components/TokenSelectModal';
import type { Token } from './types';
import { processTokenData } from './utils';

export default function App() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [fromToken, setFromToken] = useState<Token | null>(null);
  const [toToken, setToToken] = useState<Token | null>(null);
  const [fromAmount, setFromAmount] = useState<string>('');
  const [toAmount, setToAmount] = useState<string>('');
  const [isFromModalOpen, setIsFromModalOpen] = useState<boolean>(false);
  const [isToModalOpen, setIsToModalOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSwapping, setIsSwapping] = useState<boolean>(false);

  const MOCK_BALANCE = 10;

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch('https://interview.switcheo.com/prices.json');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const processedTokens = processTokenData(data);
        setTokens(processedTokens);
        setFromToken(processedTokens.find(t => t.currency === 'ETH') || null);
        setToToken(processedTokens.find(t => t.currency === 'USDC') || null);
      } catch (error) {
        console.error("Failed to fetch token prices:", error);
        setError("Failed to load token prices.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrices();
  }, []);

  useEffect(() => {
    const fromAmountNum = parseFloat(fromAmount);
    if (fromAmountNum > 0 && fromToken && toToken && fromToken.price && toToken.price) {
      const rate = fromToken.price / toToken.price;
      const calculatedToAmount = fromAmountNum * rate;
      setToAmount(calculatedToAmount.toFixed(6));

      if (fromAmountNum > MOCK_BALANCE) {
        setError(`Insufficient ${fromToken.currency} balance`);
      } else {
        setError('');
      }
    } else {
      setToAmount('');
      if (fromAmountNum > MOCK_BALANCE && fromToken) {
        setError(`Insufficient ${fromToken.currency} balance`);
      } else {
        setError('');
      }
    }
  }, [fromAmount, fromToken, toToken]);

  const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || Number(value) >= 0) {
      setFromAmount(value);
    }
  };

  const handleSelectFromToken = (token: Token) => {
    if (toToken && toToken.currency === token.currency) {
      setToToken(fromToken);
    }
    setFromToken(token);
    setIsFromModalOpen(false);
    setSearchTerm('');
  };

  const handleSelectToToken = (token: Token) => {
    if (fromToken && fromToken.currency === token.currency) {
      setFromToken(toToken);
    }
    setToToken(token);
    setIsToModalOpen(false);
    setSearchTerm('');
  };

  const handleSwapTokens = () => {
    if (isSwapping) return;
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount);
  };

  const handleSwapClick = () => {
    setIsSwapping(true);
    setTimeout(() => {
      setFromAmount('');
      setIsSwapping(false);
    }, 2000);
  };

  const isButtonDisabled = !fromAmount || parseFloat(fromAmount) <= 0 || !!error || isSwapping;

  if (isLoading) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center font-sans text-white">
        <div className="text-xl">Loading tokens...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center font-sans text-white p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-1 mb-2">
          <h1 className="text-xl font-semibold p-3 text-center">Currency Swap</h1>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-4 relative">
          <div className="space-y-2">
            <CurrencyInput
              label="You pay"
              amount={fromAmount}
              onAmountChange={handleFromAmountChange}
              selectedToken={fromToken}
              onSelectTokenClick={() => setIsFromModalOpen(true)}
              balance={MOCK_BALANCE}
              disabled={isSwapping}
            />
            <div className="flex justify-center -my-4 z-10">
              <button onClick={handleSwapTokens} className="bg-gray-700 p-2 rounded-full border-4 border-gray-800 text-gray-400 hover:text-white hover:rotate-180 transition-transform duration-300">
                <ArrowDownIcon className="w-5 h-5" />
              </button>
            </div>
            <CurrencyInput
              label="You receive"
              amount={toAmount}
              onAmountChange={() => { }}
              selectedToken={toToken}
              onSelectTokenClick={() => setIsToModalOpen(true)}
              balance={0}
              disabled={isSwapping}
            />
          </div>

          {error && (
            <div className="mt-4 text-red-400 text-center text-sm">
              {error}
            </div>
          )}

          <div className="mt-4">
            <button
              onClick={handleSwapClick}
              className={`w-full text-white font-bold py-4 px-4 rounded-2xl text-xl transition-colors duration-200 ${isButtonDisabled ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
              disabled={isButtonDisabled}
            >
              {isSwapping ? 'Swapping...' : (error ? error : 'Swap')}
            </button>
          </div>
        </div>
      </div>

      <TokenSelectModal
        isOpen={isFromModalOpen}
        onClose={() => setIsFromModalOpen(false)}
        tokens={tokens.filter(t => !toToken || t.currency !== toToken.currency)}
        onSelectToken={handleSelectFromToken}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <TokenSelectModal
        isOpen={isToModalOpen}
        onClose={() => setIsToModalOpen(false)}
        tokens={tokens.filter(t => !fromToken || t.currency !== fromToken.currency)}
        onSelectToken={handleSelectToToken}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
    </div>
  );
}
