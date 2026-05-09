// src/lib/travel-api.ts

export type TransportType = 'flight' | 'train' | 'bus'

interface SearchParams {
  type: TransportType
  origin: string
  destination: string
  date: string
  passengers: number
}

export function getRedirectUrl({ type, origin, destination, date, passengers }: SearchParams): string {
  const encodedOrigin = encodeURIComponent(origin)
  const encodedDest = encodeURIComponent(destination)
  
  // Format: YYYY-MM-DD
  const dateObj = new Date(date)
  const formattedDate = dateObj.toISOString().split('T')[0]

  switch (type) {
    case 'flight':
      // Google Flights format: /flights?q=flights+from+ORIGIN+to+DESTINATION+on+DATE
      return `https://www.google.com/travel/flights?q=flights%20from%20${encodedOrigin}%20to%20${encodedDest}%20on%20${formattedDate}%20for%20${passengers}%20adults`
    
    case 'train':
      // IRCTC/Trainman search: Search trains between stations
      // For MVP, we redirect to a popular aggregator with pre-filled search
      return `https://www.confirmtkt.com/train-schedule/${encodedOrigin}-to-${encodedDest}?date=${formattedDate.split('-').reverse().join('-')}`
    
    case 'bus':
      // RedBus search
      return `https://www.redbus.in/search?fromCityName=${encodedOrigin}&toCityName=${encodedDest}&onwardDate=${formattedDate}`
    
    default:
      return '#'
  }
}
