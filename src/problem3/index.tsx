import React, { useMemo } from 'react'

interface WalletBalance {
    currency: string;
    amount: number;
    blockchain: string; // Fix: Added missing property
}
interface FormattedWalletBalance {
    currency: string;
    amount: number;
    formatted: string;
}

interface Props extends BoxProps {

}
const WalletPage: React.FC<{ Props }> = (props: Props) => {
    const { children, ...rest } = props;
    const balances: WalletBalance[] = []
    const prices: { [key: string]: number } = {}

    const getPriority = (blockchain: string): number => { // Fix: Changed 'any' to 'string'
        switch (blockchain) {
            case 'Osmosis':
                return 100
            case 'Ethereum':
                return 50
            case 'Arbitrum':
                return 30
            case 'Zilliqa':
                return 20
            case 'Neo':
                return 20
            default:
                return -99
        }
    }

    const sortedBalances = useMemo(() => {
        return balances.filter((balance: WalletBalance) => {
            const balancePriority = getPriority(balance.blockchain)
            // Fix: Corrected filtering logic
            return balancePriority > -99 && balance.amount > 0
        }).sort((lhs: WalletBalance, rhs: WalletBalance) => {
            const leftPriority = getPriority(lhs.blockchain)
            const rightPriority = getPriority(rhs.blockchain)
            if (leftPriority > rightPriority) {
                return -1
            } else if (rightPriority > leftPriority) {
                return 1
            }
            return 0 // Fix: Added default return for sort
        })
    }, [balances]) // Fix: Removed unnecessary 'prices' dependency

    // Fix: Removed unused 'formattedBalances' variable

    const rows = sortedBalances.map((balance: WalletBalance) => { // Fix: Corrected type and key
        const usdValue = prices[balance.currency] * balance.amount
        return (
            <WalletRow
                key={balance.currency} // Fix: Used unique currency instead of index
                amount={balance.amount}
                usdValue={usdValue}
                formattedAmount={balance.amount.toFixed()} // Fix: Formatting moved here
            />
        )
    })

    return (
        <div {...rest}>
            {rows}
        </div>
    )
}