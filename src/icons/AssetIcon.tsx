import { AssetSymbol } from '../lib/assets'

interface AssetIconProps {
  symbol: AssetSymbol | string
  size?: number
}

export default function AssetIcon({ symbol, size = 44 }: AssetIconProps) {
  const symbolUpper = symbol.toUpperCase()

  return (
    <div
      style={{
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <img
        src={`/images/asset_logos/${symbolUpper}.svg`}
        alt={`${symbolUpper} logo`}
        width={size}
        height={size}
        style={{
          objectFit: 'contain',
        }}
      />
    </div>
  )
}
