import { useMemo } from 'react'
import { useStore } from '../lib/useStore'
import {
  savedStore,
  toggleSavedFlight,
  toggleSavedStay,
  type SavedFlight,
  type SavedStay,
} from '../lib/savedStore'
import { pushToast } from '../lib/toastStore'

interface SaveButtonFlightProps {
  kind: 'flight'
  flight: Omit<SavedFlight, 'savedAt'>
}
interface SaveButtonStayProps {
  kind: 'stay'
  stay: Omit<SavedStay, 'savedAt'>
}
type SaveButtonProps = SaveButtonFlightProps | SaveButtonStayProps

export function SaveButton(props: SaveButtonProps) {
  const state = useStore(savedStore)
  const saved = useMemo(() => {
    if (props.kind === 'flight') return state.flights.some(f => f.id === props.flight.id)
    return state.stays.some(s => s.id === props.stay.id)
  }, [state, props])

  function onClick(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (props.kind === 'flight') {
      const nowSaved = toggleSavedFlight(props.flight)
      pushToast({
        tone: nowSaved ? 'success' : 'info',
        title: nowSaved ? 'Flight saved' : 'Removed from saved',
        body: `${props.flight.from} → ${props.flight.to}`,
      })
    } else {
      const nowSaved = toggleSavedStay(props.stay)
      pushToast({
        tone: nowSaved ? 'success' : 'info',
        title: nowSaved ? 'Stay saved' : 'Removed from saved',
        body: props.stay.name,
      })
    }
  }

  return (
    <button
      type="button"
      className={`save-btn ${saved ? 'is-saved' : ''}`}
      aria-pressed={saved}
      aria-label={saved ? 'Remove from saved' : 'Save'}
      onClick={onClick}
    >
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
        <path
          d="M12 21s-7.5-4.35-10-9.5C.5 7.5 3 4 6.5 4c2 0 3.5 1 5.5 3 2-2 3.5-3 5.5-3C21 4 23.5 7.5 22 11.5 19.5 16.65 12 21 12 21Z"
          fill={saved ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}
