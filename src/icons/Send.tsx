export default function SendIcon() {
  return (
    <svg width='16' height='20' viewBox='0 0 16 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
      {/* Arrow pointing up */}
      <path d='M8 4L8 14' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' />
      <path d='M4 8L8 4L12 8' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
      {/* Line underneath */}
      <line x1='2' y1='18' x2='14' y2='18' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' />
    </svg>
  )
}
