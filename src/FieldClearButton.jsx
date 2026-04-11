export function FieldClearButton({ ariaLabel, onClear }) {
  return (
    <button
      type="button"
      className="flight-search__field-clear"
      aria-label={ariaLabel}
      onMouseDown={e => e.preventDefault()}
      onClick={e => {
        e.stopPropagation()
        onClear()
      }}
    >
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
