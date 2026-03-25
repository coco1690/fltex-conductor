export type LatLng = {
  latitude: number
  longitude: number
}

/**
 * Convierte coordenadas a formato Mapbox: lng,lat;lng,lat
 */
export function buildMapboxCoords(points: LatLng[]) {
  return points.map(p => `${p.longitude},${p.latitude}`).join(';')
}

/**
 * Convierte GeoJSON de Mapbox a formato React Native Maps
 */
export function mapboxToLatLng(
  coords: [number, number][]
): LatLng[] {
  return coords.map(([lng, lat]) => ({
    latitude: lat,
    longitude: lng,
  }))
}

/**
 * Ordena paradas según waypoints de Mapbox
 */
export function sortStopsByWaypoints<T extends { latitud: number; longitud: number }>(
  stops: T[],
  waypoints: { waypoint_index: number }[]
) {
  // Mapbox devuelve el orden incluyendo el punto inicial (driver)
  // así que ignoramos el index 0
  return waypoints
    .slice(1)
    .map(wp => stops[wp.waypoint_index - 1])
}