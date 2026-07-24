import { useState } from 'react'
import { PageShell } from './PageShell'

interface FlightItem {
  id: string
  route: string
  carrier: string
  departure: string
}

const INITIAL_FLIGHTS: FlightItem[] = [
  { id: 'BA249', route: 'London → New York', carrier: 'British Airways', departure: '08:15' },
  { id: 'VS411', route: 'London → Tokyo', carrier: 'Virgin Atlantic', departure: '11:40' },
  { id: 'AF1234', route: 'Paris → Rome', carrier: 'Air France', departure: '14:05' },
  { id: 'EK502', route: 'Dubai → Sydney', carrier: 'Emirates', departure: '21:30' },
  { id: 'KL602', route: 'Amsterdam → Cape Town', carrier: 'KLM', departure: '19:55' },
]

export function ListsPage() {
  const [flights, setFlights] = useState<FlightItem[]>(INITIAL_FLIGHTS)

  const remove = (id: string) => {
    setFlights(current => current.filter(flight => flight.id !== id))
  }

  return (
    <PageShell
      title="Flights"
      subtitle="A prototype list — remove any flight you don't want."
      breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Lists' }]}
    >
      {flights.length === 0 ? (
        <p className="text-grey-600 bg-white border border-grey-200 rounded-card py-8 px-6 text-center">
          No flights left in the list.
        </p>
      ) : (
        <ul className="list-none p-0 m-0 flex flex-col gap-3">
          {flights.map(flight => (
            <li
              key={flight.id}
              className="flex items-center gap-4 bg-white border border-grey-200 rounded-card py-4 px-5"
            >
              <div className="flex-1 min-w-0">
                <p className="text-grey-900 font-semibold m-0">{flight.route}</p>
                <p className="text-sm text-grey-600 mt-1 m-0">
                  {flight.carrier} · {flight.id} · departs {flight.departure}
                </p>
              </div>
              <button
                type="button"
                onClick={() => remove(flight.id)}
                className="flex-shrink-0 py-2 px-4 border border-grey-200 rounded-full font-sans cursor-pointer text-sm text-grey-600 bg-white hover:border-danger hover:text-danger"
                aria-label={`Delete flight ${flight.id}`}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </PageShell>
  )
}
