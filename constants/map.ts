/** Shared map and layout constants used across map and list components. */

/** Maximum zoom level for the Leaflet map. */
export const MAX_ZOOM = 18;

/** Default map centre (Mumbai harbour area). */
export const DEFAULT_CENTER: [number, number] = [18.9582, 72.8321];

/** Pixel width below which the layout is treated as mobile. */
export const MOBILE_BREAKPOINT = 768;

/**
 * Fraction of map height to shift the fly-to target upward on mobile.
 * Keeps the marker near the bottom-centre so the popup is fully visible.
 */
export const MOBILE_MAP_OFFSET_FRACTION = 0.32;

/** Fallback image shown when a pandal has no image or its image fails to load.
 *  Served from public/ to avoid dependency on an external CDN. */
export const FALLBACK_PANDAL_IMAGE = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/fallback-pandal.jpg`;
