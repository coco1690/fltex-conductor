import { buildMapboxCoords, mapboxToLatLng } from './mapbox'
import type { MapboxOptimizedTripResponse } from '../types/mapbox'

type LatLng = {
  latitude: number
  longitude: number
}

const MAPBOX_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_TOKEN!

// Directions API — para 1 sola parada
async function directRouteMapbox(driver: LatLng, stop: LatLng) {
  const coords = buildMapboxCoords([driver, stop])
  const url =
    `https://api.mapbox.com/directions/v5/mapbox/driving/${coords}` +
    `?geometries=geojson` +
    `&overview=full` +
    `&steps=false` +
    `&access_token=${MAPBOX_TOKEN}`

  const response = await fetch(url)
  const data = await response.json()

  if (!response.ok || !data.routes?.[0]) {
    throw new Error(data?.message || 'Error Mapbox Directions')
  }

  const route = data.routes[0]
  return {
    distance: route.distance ?? 0,
    duration: route.duration ?? 0,
    routeCoords: mapboxToLatLng(route.geometry?.coordinates ?? []),
    // Para 1 parada el orden es siempre [conductor, parada] — sin optimización
    waypoints: [
      { waypoint_index: 0 },
      { waypoint_index: 1 },
    ],
    raw: data,
  }
}

// Optimized Trips API — para 2 o más paradas
async function optimizedTripsMapbox(driver: LatLng, stops: LatLng[]) {
  const allPoints = [driver, ...stops]
  const coords = buildMapboxCoords(allPoints)

  const url =
    `https://api.mapbox.com/optimized-trips/v1/mapbox/driving/${coords}` +
    `?geometries=geojson` +
    `&source=first` +
    `&destination=any` +
    `&roundtrip=false` +
    `&overview=full` +
    `&steps=false` +
    `&access_token=${MAPBOX_TOKEN}`

  const response = await fetch(url)
  const data: MapboxOptimizedTripResponse = await response.json()

  if (!response.ok || data.code !== 'Ok') {
    throw new Error(data?.code || 'Error Mapbox Optimized Trips')
  }

  const trip = data.trips?.[0]
  return {
    distance: trip?.distance ?? 0,
    duration: trip?.duration ?? 0,
    routeCoords: mapboxToLatLng(trip?.geometry?.coordinates ?? []),
    waypoints: data.waypoints ?? [],
    raw: data,
  }
}

// Función principal — elige la API correcta según el número de paradas
export async function optimizeRouteMapbox(driver: LatLng, stops: LatLng[]) {
  if (stops.length === 0) {
    throw new Error('Se necesita al menos una parada')
  }

  if (stops.length === 1) {
    return directRouteMapbox(driver, stops[0])
  }

  return optimizedTripsMapbox(driver, stops)
}