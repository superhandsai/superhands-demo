/**
 * Airport search index (OpenFlights / OurAirports via @nwpr/airport-codes).
 * Loaded asynchronously so the main bundle stays small.
 */

const POPULAR_IATA = [
  'LHR',
  'JFK',
  'LAX',
  'SFO',
  'ORD',
  'ATL',
  'CDG',
  'DXB',
  'SIN',
  'HKG',
  'NRT',
  'AMS',
  'FRA',
  'MAD',
  'BCN',
  'SYD',
  'MEL',
  'YYZ',
  'DEN',
  'SEA',
  'LAS',
  'MCO',
  'MIA',
  'BOS',
  'PHX',
  'IAH',
  'MSP',
  'CLT',
  'PDX',
  'AUS',
  'SJC',
  'EWR',
  'LGW',
  'STN',
  'MAN',
  'DUB',
  'ZRH',
  'VIE',
  'CPH',
  'OSL',
  'ARN',
  'HEL',
  'WAW',
  'PRG',
  'BUD',
  'LIS',
  'OPO',
  'FCO',
  'MXP',
  'ATH',
  'TLV',
  'CAI',
  'JNB',
  'CPT',
  'NBO',
  'BOM',
  'DEL',
  'BLR',
  'BKK',
  'KUL',
  'CGK',
  'ICN',
  'PEK',
  'PVG',
  'CAN',
  'TPE',
  'MEX',
  'GRU',
  'EZE',
  'SCL',
  'LIM',
  'BOG',
  'PTY',
  'AKL',
  'WLG',
  'CHC',
]

/** Strip "Airport" phrasing from dataset names for UI labels (dropdown, field value). */
export function stripAirportFromDisplayName(s) {
  if (s == null || typeof s !== 'string') return s
  let t = s.trim()
  if (!t) return t
  t = t.replace(/\s+International\s+Airport\b/gi, ' ')
  t = t.replace(/\s+Intl\.?\s+Airport\b/gi, ' ')
  t = t.replace(/\bAirport\b/gi, '')
  t = t.replace(/\s{2,}/g, ' ').trim()
  return t || s.trim()
}

/**
 * Location line only (no IATA): "Los Angeles", "New York John F Kennedy", "London Heathrow".
 */
export function buildAirportLocationLabel(a) {
  if (!a) return ''
  const city = (a.city || '').trim()
  const nameClean = stripAirportFromDisplayName(a.name || '') || ''
  const code = (a.code || '').trim()

  if (!city && !nameClean) return code
  if (!city) return nameClean
  if (!nameClean) return city

  if (nameClean.localeCompare(city, undefined, { sensitivity: 'accent' }) === 0) {
    return city
  }

  const cityLower = city.toLowerCase()
  const nameLower = nameClean.toLowerCase()

  if (nameLower === cityLower) return city

  if (nameLower.startsWith(cityLower + ' ')) {
    return nameClean
  }

  return `${city} ${nameClean}`
}

/** Primary dropdown / field label: "Los Angeles (LAX)". */
export function buildAirportOptionTitle(a) {
  if (!a) return ''
  const loc = buildAirportLocationLabel(a)
  const code = (a.code || '').trim()
  if (!code) return loc
  if (!loc) return code
  return `${loc} (${code})`
}

export function buildAirportOptionSubtitle(a) {
  if (!a) return ''
  return (a.country || '').trim()
}

function buildIndexes(rawAirports) {
  const byCode = new Map()
  for (const row of rawAirports) {
    const code = typeof row.iata === 'string' ? row.iata.trim().toUpperCase() : ''
    if (!code || code.length !== 3 || !/^[A-Z]{3}$/.test(code)) continue
    if (byCode.has(code)) continue
    const name = row.name?.trim() || code
    const city = row.city?.trim() || ''
    const country = row.country?.trim() || ''
    byCode.set(code, { code, name, city, country })
  }
  const all = [...byCode.values()].sort((a, b) => {
    const ka = (a.city || a.name).toLowerCase()
    const kb = (b.city || b.name).toLowerCase()
    return ka.localeCompare(kb, undefined, { sensitivity: 'base' }) || a.code.localeCompare(b.code)
  })
  return { byCode, all }
}

function createApi(rawAirports) {
  const { byCode, all } = buildIndexes(rawAirports)

  function getAirportByCode(code) {
    if (!code) return null
    return byCode.get(String(code).trim().toUpperCase()) ?? null
  }

  function formatAirportFieldValue(code) {
    const a = getAirportByCode(code)
    if (!a) return code || ''
    return buildAirportOptionTitle(a)
  }

  function searchAirports(query, { limit = 80, excludeCodes = [] } = {}) {
    const ex = new Set(excludeCodes.map(c => String(c).trim().toUpperCase()).filter(Boolean))
    const q = query.trim().toLowerCase()
    const max = Math.min(Math.max(limit, 1), 200)

    if (!q) {
      const out = []
      const seen = new Set()
      for (const code of POPULAR_IATA) {
        if (ex.has(code)) continue
        const a = byCode.get(code)
        if (a) {
          out.push(a)
          seen.add(code)
        }
        if (out.length >= max) return out
      }
      for (const a of all) {
        if (ex.has(a.code) || seen.has(a.code)) continue
        out.push(a)
        if (out.length >= max) break
      }
      return out
    }

    const scored = []
    for (const a of all) {
      if (ex.has(a.code)) continue
      const code = a.code.toLowerCase()
      const city = a.city.toLowerCase()
      const name = a.name.toLowerCase()
      const country = a.country.toLowerCase()

      let tier = 99
      if (code === q) tier = 0
      else if (code.startsWith(q)) tier = 1
      else if (city.startsWith(q)) tier = 2
      else if (name.startsWith(q)) tier = 3
      else if (city.includes(q) || name.includes(q)) tier = 4
      else if (country.includes(q) || code.includes(q)) tier = 5
      else continue

      scored.push({ a, tier })
    }

    scored.sort((x, y) => {
      if (x.tier !== y.tier) return x.tier - y.tier
      const cx = (x.a.city || x.a.name).toLowerCase()
      const cy = (y.a.city || y.a.name).toLowerCase()
      const c = cx.localeCompare(cy, undefined, { sensitivity: 'base' })
      if (c !== 0) return c
      return x.a.code.localeCompare(y.a.code)
    })

    return scored.slice(0, max).map(s => s.a)
  }

  return { getAirportByCode, formatAirportFieldValue, searchAirports }
}

let cachedApi = null
let loadPromise = null

/** Single shared load — airport JSON is fetched/parsed once. */
export function getAirportApi() {
  if (cachedApi) return Promise.resolve(cachedApi)
  if (!loadPromise) {
    loadPromise = import('@nwpr/airport-codes/dist/airports.json').then(m => {
      cachedApi = createApi(m.default)
      return cachedApi
    })
  }
  return loadPromise
}
