import { useContext, useState } from 'react'
import { ConfigContext } from '../providers/config'
import { FiatContext } from '../providers/fiat'
import { prettyNumber } from '../lib/format'
import { ASSETS, type AssetSymbol } from '../lib/assets'
import CurrencySwapIcon from '../icons/CurrencySwap'

interface InlineAmountInputProps {
  value: number
  onChange: (value: number) => void
  asset: AssetSymbol
  disabled?: boolean
  placeholder?: string
  fiatEquivalent?: string // Optional custom fiat display
  currencyOverride?: string // Optional: override asset symbol display (for bank fiat currencies)
  skipPrecision?: boolean // Optional: skip precision conversion (for bank fiat amounts)
}

/**
 * Reusable inline amount input component with large centered text
 * Used across Send, Receive (Lightning), and Bank Transfer screens
 */
export default function InlineAmountInput({
  value,
  onChange,
  asset,
  disabled = false,
  placeholder = '0',
  fiatEquivalent,
  currencyOverride,
  skipPrecision = false,
}: InlineAmountInputProps) {
  const { config } = useContext(ConfigContext)
  const { toFiat, fromFiat } = useContext(FiatContext)
  
  // Track whether user is entering in crypto or fiat
  const [inputMode, setInputMode] = useState<'crypto' | 'fiat'>('crypto')
  // Track the actual input string to avoid conversion issues during typing
  const [inputString, setInputString] = useState('')

  const assetInfo = ASSETS[asset]
  
  // Calculate display values based on input mode
  const cryptoValue = skipPrecision
    ? value
    : value / Math.pow(10, assetInfo.precision)
  
  const fiatValue = skipPrecision
    ? value // For bank transfers, value is already in fiat currency (EUR/CHF), not satoshis
    : toFiat(value)
  
  // Use inputString while typing, or calculated value when empty/switching modes
  const displayValue = inputString || (inputMode === 'crypto' 
    ? (cryptoValue || '')
    : (fiatValue || ''))

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    
    // Only allow numbers and decimal point
    const validInput = /^[0-9]*\.?[0-9]*$/.test(inputValue)
    if (!validInput && inputValue !== '') {
      return
    }
    
    setInputString(inputValue)
    
    if (inputValue === '' || inputValue === '0') {
      onChange(0)
    } else {
      const numValue = parseFloat(inputValue)
      if (!isNaN(numValue) && numValue >= 0) {
        let finalValue: number
        
        if (inputMode === 'fiat') {
          // User entered fiat, convert to base units (satoshis)
          if (skipPrecision) {
            // For bank transfers, value is stored directly in fiat
            finalValue = numValue
          } else {
            // For crypto, convert from fiat to satoshis
            finalValue = fromFiat(numValue)
          }
        } else {
          // User entered crypto, convert to base units if needed
          finalValue = skipPrecision
            ? numValue
            : Math.floor(numValue * Math.pow(10, assetInfo.precision))
        }
        
        onChange(finalValue)
      }
    }
  }
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Prevent 'e', 'E', '+', '-' which are valid in number inputs
    if (['e', 'E', '+', '-'].includes(e.key)) {
      e.preventDefault()
    }
  }
  
  const handleSwap = () => {
    setInputString('') // Clear input string when switching modes
    setInputMode(inputMode === 'crypto' ? 'fiat' : 'crypto')
  }

  // Display strings
  const currencySymbol = currencyOverride || assetInfo.symbol
  const primaryCurrency = inputMode === 'crypto' ? currencySymbol : config.fiat
  const secondaryValue = inputMode === 'crypto'
    ? `${prettyNumber(fiatValue, 2)} ${config.fiat}`
    : fiatEquivalent || `${prettyNumber(cryptoValue, 8)} ${currencySymbol}`

  // Calculate dynamic font size based on number of digits
  const displayString = String(displayValue)
  const numDigits = displayString.length || 1
  const fontSize = numDigits <= 6 ? '2.5rem' : numDigits <= 10 ? '2rem' : '1.5rem'
  const currencyFontSize = numDigits <= 6 ? '1.25rem' : numDigits <= 10 ? '1rem' : '0.875rem'
  const inputWidth = `${Math.max(numDigits + 1, 4)}ch` // Dynamic width based on content

  return (
    <div style={{ textAlign: 'center', width: '100%', marginTop: '1rem' }}>
      <div style={{ marginBottom: '0.5rem', color: 'var(--white70)', fontSize: '0.875rem' }}>
        Amount
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
        <input
          type="number"
          step="any"
          inputMode="decimal"
          value={displayValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          style={{
            fontSize,
            fontWeight: 700,
            color: 'white',
            fontFamily: 'monospace',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            textAlign: 'right',
            width: inputWidth,
            padding: '0.25rem',
          }}
        />
        <span style={{ fontSize: currencyFontSize, fontWeight: 600, color: 'white' }}>
          {primaryCurrency}
        </span>
      </div>
      {/* Swap icon */}
      <button
        onClick={handleSwap}
        disabled={disabled}
        style={{
          background: 'transparent',
          border: 'none',
          cursor: disabled ? 'default' : 'pointer',
          padding: '0.5rem',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: disabled ? 0.5 : 1,
        }}
        aria-label="Toggle between crypto and fiat"
      >
        <div style={{ width: '20px', height: '20px', color: 'var(--white50)' }}>
          <CurrencySwapIcon />
        </div>
      </button>
      {/* Fiat/Crypto equivalent */}
      <div style={{ fontSize: '1rem', color: 'var(--white50)', marginTop: '0.25rem' }}>
        {secondaryValue}
      </div>
    </div>
  )
}
