import { ChevronDownIcon } from "../assets/Icons";
import type { Token } from "../types";

interface CurrencyInputProps {
    label: string;
    amount: string;
    onAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    selectedToken: Token | null;
    onSelectTokenClick: () => void;
    balance: number;
    disabled?: boolean;
}

const CurrencyInput: React.FC<CurrencyInputProps> = ({
    label,
    amount,
    onAmountChange,
    selectedToken,
    onSelectTokenClick,
    balance,
    disabled = false
}) => {
    return (
        <div className={`bg-gray-800 p-4 rounded-2xl transition-opacity duration-200 ${disabled ? 'opacity-50' : ''}`}>
            <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400 text-sm font-medium">{label}</span>
                <span className="text-gray-400 text-sm">Balance: {balance.toFixed(4)}</span>
            </div>
            <div className="flex justify-between items-center">
                <input
                    type="number"
                    placeholder="0.0"
                    value={amount}
                    onChange={onAmountChange}
                    disabled={disabled}
                    className={`bg-transparent text-3xl font-medium text-white w-full focus:outline-none ${disabled ? 'cursor-not-allowed' : ''}`}
                    min="0"
                />
                <button
                    onClick={onSelectTokenClick}
                    disabled={disabled}
                    className={`bg-gray-900 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-full flex items-center transition-colors duration-200 ${disabled ? 'cursor-not-allowed' : ''}`}
                >
                    {selectedToken ? (
                        <>
                            <img src={selectedToken.icon} alt={selectedToken.currency} className="w-6 h-6 mr-2 rounded-full" onError={(e) => { (e.target as HTMLImageElement).onerror = null; (e.target as HTMLImageElement).src = 'https://placehold.co/24x24/2d3748/ffffff?text=?'; }} />
                            {selectedToken.currency}
                        </>
                    ) : (
                        "Select Token"
                    )}
                    <ChevronDownIcon />
                </button>
            </div>
        </div>
    );
};

export default CurrencyInput;