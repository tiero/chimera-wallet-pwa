export type TransferMethod = 'bitcoin' | 'ark' | 'lightning' | 'bank'

export const TRANSFER_METHOD = {
  bitcoin: 'bitcoin',
  ark: 'ark',
  lightning: 'lightning',
  bank: 'bank',
} as const

export const TRANSFER_METHOD_OPTIONS: TransferMethod[] = ['bitcoin', 'ark', 'lightning', 'bank']

export const TRANSFER_METHOD_LABELS: Record<TransferMethod, string> = {
  bitcoin: 'Bitcoin (Native)',
  ark: 'Bitcoin (Ark)',
  lightning: 'Bitcoin (Lightning)',
  bank: 'Bank Transfer',
}

export const SEND_METHOD_TIME_TEXT: Record<TransferMethod, string> = {
  bitcoin:
    'The transfer time for on-chain Bitcoin depends on network congestion and is, on average, 10 minutes for the first confirmation. If your wallet supports ARK VTXO the transaction will be instant.',
  ark:
    'The transfer time for on-chain Ark depends on network congestion and is, on average, 10 minutes for the first confirmation. If your wallet supports ARK VTXO the transaction will be instant.',
  lightning:
    'The transfer time for the lightning network depends on several factors and is, on average, a few seconds.',
  bank: 'The transfer time might vary depending on the bank, from instant to 48 hours.',
}

export const SEND_METHOD_FEES_TEXT: Record<TransferMethod, string> = {
  bitcoin:
    'Fees are dynamic on the Bitcoin network and are related to how fast you want to receive your transaction and how the sending wallet manages the transactions. Fees for ARK compatible wallets are close to 0.',
  ark:
    'Fees are dynamic on the Ark network and are related to how fast you want to receive your transaction and how the sending wallet manages the transactions. Fees for ARK compatible wallets are close to 0.',
  lightning: 'Fees are dynamic on lightning, usually less than 0.01$.',
  bank:
    'The fees for bank sends are 0.3% of the sent amount plus 10 CHF if over 1000 CHF. The fees for bank sends are 1% of the sent amount plus 10 CHF if under 1000 CHF. Your bank might charge some additional fees we are not aware of.',
}

export const SEND_METHOD_WARNING_TEXT: Record<TransferMethod, string> = {
  bitcoin:
    'Please ensure you send only Bitcoin to a valid ARK or mainnet address. Any other address will cause the assets to be forever lost, and there is no option to recover it.',
  ark:
    'Please ensure you send only Bitcoin to a valid ARK or mainnet address. Any other address will cause the assets to be forever lost, and there is no option to recover it.',
  lightning:
    'Please send only using a Lighting network invoice. Any other address will cause the assets to be forever lost, and there is no option to recover it.',
  bank: 'The transfer time might vary depending on the bank, from instant to 48 hours.',
}

export const RECEIVE_METHOD_TIME_TEXT: Record<TransferMethod, string> = {
  bitcoin:
    'The transfer time for on-chain Bitcoin depends on network congestion and is, on average, 10 minutes for the first confirmation. You should receive your funds after at least 6 confirmations (average of 1 hour).',
  ark:
    'The transfer time for on-chain Ark depends on network congestion and is, on average, 10 minutes for the first confirmation. You should receive your funds after at least 6 confirmations (average of 1 hour).',
  lightning:
    'The transfer time for the lightning network depends on several factors and is, on average, a few seconds.',
  bank: 'The transfer time might vary depending on the bank, from instant to 48 hours.',
}

export const RECEIVE_METHOD_FEES_TEXT: Record<TransferMethod, string> = {
  bitcoin:
    'Fees are dynamic on the Bitcoin network and are related to how fast you want to receive your transaction and how the sending wallet manages the transactions. There is a 0.3% fee for the fast receive method.',
  ark:
    'Fees are dynamic on the Ark network and are related to how fast you want to receive your transaction and how the sending wallet manages the transactions. Fees for ARK compatible wallets are close to 0.',
  lightning: 'Fees are dynamic on lightning, usually less than 0.01$.',
  bank:
    'The fees for bank receives are 0.6% of the received amount plus 10 CHF if over 1000 CHF. The fees for bank receives are 1% of the received amount plus 10 CHF if under 1000 CHF. Your bank might charge some additional fees we are not aware of.',
}

export const RECEIVE_METHOD_WARNING_TEXT: Record<TransferMethod, string> = {
  bitcoin:
    'Please send only Bitcoin either using ARK or mainnet. Any other asset sent will be forever lost, and there is no option to recover it.',
  ark:
    'Please send only Bitcoin using an ARK compatible wallet. Any other asset sent will be forever lost, and there is no option to recover it.',
  lightning:
    'Please send only Bitcoin using the Lighting network. Any other asset sent will be forever lost, and there is no option to recover it.',
  bank: 'The transfer time might vary depending on the bank, from instant to 48 hours.',
}
