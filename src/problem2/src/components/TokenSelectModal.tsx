import { SearchIcon, XIcon } from "../assets/Icons";
import type { Token } from "../types";

interface TokenSelectModalProps {
    isOpen: boolean;
    onClose: () => void;
    tokens: Token[];
    onSelectToken: (token: Token) => void;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
}

const TokenSelectModal: React.FC<TokenSelectModalProps> = ({ isOpen, onClose, tokens, onSelectToken, searchTerm, setSearchTerm }) => {
    if (!isOpen) return null;

    const filteredTokens = tokens.filter(token =>
        token.currency.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-2xl w-full max-w-md flex flex-col" style={{ height: '90vh', maxHeight: '500px' }}>
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <h2 className="text-white text-lg font-semibold">Select a token</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <XIcon />
                    </button>
                </div>
                <div className="p-4 border-b border-gray-700">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <SearchIcon />
                        </div>
                        <input
                            type="text"
                            placeholder="Search name or paste address"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
                <div className="flex-grow overflow-y-auto p-2">
                    {filteredTokens.length > 0 ? (
                        filteredTokens.map(token => (
                            <button
                                key={token.currency}
                                onClick={() => onSelectToken(token)}
                                className="w-full flex items-center p-3 hover:bg-gray-700 rounded-lg transition-colors duration-150"
                            >
                                <img
                                    src={token.icon}
                                    alt={token.currency}
                                    className="w-8 h-8 mr-4 rounded-full bg-gray-600"
                                    onError={(e) => { (e.target as HTMLImageElement).onerror = null; (e.target as HTMLImageElement).src = 'https://placehold.co/40x40/2d3748/ffffff?text=?'; }}
                                />
                                <div className="text-left">
                                    <p className="text-white font-medium">{token.currency}</p>
                                    <p className="text-gray-400 text-sm">{token.currency}</p>
                                </div>
                            </button>
                        ))
                    ) : (
                        <p className="text-gray-400 text-center p-4">No tokens found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TokenSelectModal;