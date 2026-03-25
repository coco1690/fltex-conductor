export type MapboxOptimizedTripResponse = {
  code: string
  trips: Array<{
    distance: number
    duration: number
    geometry: {
      coordinates: [number, number][]
      type: string
    }
  }>
  waypoints: Array<{
    waypoint_index: number
    trips_index: number
    name: string
    location: [number, number]
  }>
}