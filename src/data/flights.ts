/**
 * Deterministic mock flight generation for a given route + date.
 * Given the same (from, to, date) params, returns the same list of flights — so
 * that the results and detail pages stay consistent across navigation.
 */

export interface FlightSegment {
  carrier: string
  carrierCode: string
  flightNumber: string
  from: string
  to: string
  departDate: string
  departTime: string
  arriveDate: string
  arriveTime: string
  durationMins: number
}

export interface FlightOption {
  id: string
  outbound: FlightSegment[]
  return?: FlightSegment[]
  priceGBP: number
  stops: number
  totalDurationMins: number
  fareClass: 'economy' | 'premium' | 'business' | 'first'
  seatsRemaining: number
}

const CARRIERS: Array<{ name: string; code: string }> = [
  { name: 'British Airways', code: 'BA' },
  { name: 'Virgin Atlantic', code: 'VS' },
  { name: 'KLM', code: 'KL' },
  { name: 'Lufthansa', code: 'LH' },
  { name: 'Air France', code: 'AF' },
  { name: 'Emirates', code: 'EK' },
  { name: 'Qatar Airways', code: 'QR' },
  { name: 'Delta', code: 'DL' },
  { name: 'United', code: 'UA' },
  { name: 'American Airlines', code: 'AA' },
]

function hash(str: string): number {
  let h = 2166136261 >>> 0
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function mulberry32(seed: number) {
  let t = seed >>> 0
  return () => {
    t = (t + 0x6d2b79f5) >>> 0
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

function pad2(n: number): string {
  return String(n).padStart(2, '0')
}

function minutesToTime(totalMins: number): string {
  const h = Math.floor(totalMins / 60) % 24
  const m = totalMins % 60
  return `${pad2(h)}:${pad2(m)}`
}

function addDaysIso(iso: string, days: number): string {
  const [y, m, d] = iso.split('-').map(Number)
  const dt = new Date(y, (m ?? 1) - 1, (d ?? 1) + days)
  return `${dt.getFullYear()}-${pad2(dt.getMonth() + 1)}-${pad2(dt.getDate())}`
}

function buildSegment(
  carrier: { name: string; code: string },
  from: string,
  to: string,
  departDate: string,
  departMins: number,
  durationMins: number,
  rng: () => number,
): FlightSegment {
  const arriveMinsTotal = departMins + durationMins
  const dayOffset = Math.floor(arriveMinsTotal / (24 * 60))
  const arriveMins = arriveMinsTotal % (24 * 60)
  const flightNum = 100 + Math.floor(rng() * 2900)
  return {
    carrier: carrier.name,
    carrierCode: carrier.code,
    flightNumber: `${carrier.code}${flightNum}`,
    from,
    to,
    departDate,
    departTime: minutesToTime(departMins),
    arriveDate: dayOffset > 0 ? addDaysIso(departDate, dayOffset) : departDate,
    arriveTime: minutesToTime(arriveMins),
    durationMins,
  }
}

export interface GenerateFlightsParams {
  from: string
  to: string
  depart: string
  return?: string
}

/**
 * Baseline non-stop duration, extremely rough — just enough to vary results.
 * Real data would come from a lookup table, but this keeps results plausible.
 */
function baselineDurationMins(from: string, to: string): number {
  const key = [from, to].filter(Boolean).join('-').toUpperCase()
  const h = hash(key) % 720
  return 120 + h
}

export function generateFlights(params: GenerateFlightsParams): FlightOption[] {
  const from = (params.from || 'LHR').toUpperCase()
  const to = (params.to || 'JFK').toUpperCase()
  const depart = params.depart || '2026-05-15'
  const ret = params.return

  const seed = hash(`${from}|${to}|${depart}|${ret ?? ''}`)
  const rng = mulberry32(seed)
  const baseline = baselineDurationMins(from, to)

  const count = 8
  const options: FlightOption[] = []
  for (let i = 0; i < count; i++) {
    const stops = rng() < 0.4 ? 0 : rng() < 0.8 ? 1 : 2
    const carrier = CARRIERS[Math.floor(rng() * CARRIERS.length)]
    const departMins = 5 * 60 + Math.floor(rng() * 16 * 60)
    const legExtra = stops === 0 ? 0 : stops * (60 + Math.floor(rng() * 120))
    const outDur = baseline + legExtra + Math.floor(rng() * 45)

    let outboundSegments: FlightSegment[]
    if (stops === 0) {
      outboundSegments = [buildSegment(carrier, from, to, depart, departMins, outDur, rng)]
    } else {
      outboundSegments = []
      const hubs = ['AMS', 'CDG', 'FRA', 'DXB', 'IST', 'MAD', 'ZRH', 'DUB']
      let segFrom = from
      let segDepart = departMins
      let segDate = depart
      for (let s = 0; s <= stops; s++) {
        const segTo = s === stops ? to : hubs[Math.floor(rng() * hubs.length)]
        const legDur = Math.floor((outDur - legExtra) / (stops + 1)) + Math.floor(rng() * 30)
        const seg = buildSegment(carrier, segFrom, segTo, segDate, segDepart, legDur, rng)
        outboundSegments.push(seg)
        const arriveTotal = segDepart + legDur
        const layover = 60 + Math.floor(rng() * 120)
        segDepart = (arriveTotal + layover) % (24 * 60)
        segDate = addDaysIso(seg.departDate, Math.floor((arriveTotal + layover) / (24 * 60)))
        segFrom = segTo
      }
    }

    let returnSegments: FlightSegment[] | undefined
    if (ret) {
      const rDepart = 5 * 60 + Math.floor(rng() * 16 * 60)
      const rStops = rng() < 0.4 ? 0 : 1
      if (rStops === 0) {
        returnSegments = [buildSegment(carrier, to, from, ret, rDepart, baseline, rng)]
      } else {
        const hub = ['AMS', 'CDG', 'FRA', 'DXB'][Math.floor(rng() * 4)]
        const first = buildSegment(
          carrier,
          to,
          hub,
          ret,
          rDepart,
          Math.floor(baseline / 2),
          rng,
        )
        const layover = 60 + Math.floor(rng() * 120)
        const secondDepart = ((rDepart + Math.floor(baseline / 2) + layover) % (24 * 60))
        returnSegments = [
          first,
          buildSegment(
            carrier,
            hub,
            from,
            first.arriveDate,
            secondDepart,
            Math.floor(baseline / 2) + 30,
            rng,
          ),
        ]
      }
    }

    const priceBase = 180 + Math.floor(rng() * 620)
    const priceAdj = stops === 0 ? 120 : stops === 1 ? 0 : -60
    const priceGBP = Math.max(89, priceBase + priceAdj)

    options.push({
      id: `${from}-${to}-${depart}-${i}`,
      outbound: outboundSegments,
      return: returnSegments,
      priceGBP,
      stops,
      totalDurationMins:
        outboundSegments.reduce((sum, s) => sum + s.durationMins, 0) +
        (returnSegments?.reduce((sum, s) => sum + s.durationMins, 0) ?? 0),
      fareClass: 'economy',
      seatsRemaining: 3 + Math.floor(rng() * 20),
    })
  }

  options.sort((a, b) => a.priceGBP - b.priceGBP)
  return options
}

export function getFlightById(
  id: string,
  params: GenerateFlightsParams,
): FlightOption | null {
  const list = generateFlights(params)
  return list.find(f => f.id === id) ?? null
}

export function formatDurationMins(totalMins: number): string {
  const h = Math.floor(totalMins / 60)
  const m = totalMins % 60
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

export function formatIsoDate(iso: string): string {
  if (!iso) return ''
  const [y, m, d] = iso.split('-').map(Number)
  const dt = new Date(y, (m ?? 1) - 1, (d ?? 1))
  return dt.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}
