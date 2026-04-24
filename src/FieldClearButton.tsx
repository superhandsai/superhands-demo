interface FieldClearButtonProps {
  ariaLabel: string
  onClear: () => void
}

export function FieldClearButton({ ariaLabel, onClear }: FieldClearButtonProps) {
  return (
    <button
      type="button"
      className="absolute top-1/2 right-0 z-[2] hidden group-focus-within:flex items-center justify-center w-7 h-7 p-0 border-none rounded-lg bg-transparent text-grey-500 cursor-pointer -translate-y-1/2 hover:text-grey-900 hover:bg-grey-100 focus-visible:outline-2 focus-visible:outline-purple focus-visible:outline-offset-2"
      aria-label={ariaLabel}
      onMouseDown={e => e.preventDefault()}
      onClick={e => {
        e.stopPropagation()
        onClear()
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M18 6L6 18M6 6L18 18"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}
