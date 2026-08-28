/**
 * Base path for static assets (empty in dev, `/Ganpati-Pandal-Locator` in prod).
 * Used to prefix image URLs, favicons, and manifest links.
 */
export const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

/** Public Google Sheets CSV export URL for pandal data. */
export const CSV_URL =
  'https://docs.google.com/spreadsheets/d/1Z7Dsgv8f0eGSysC6JkOATyBDJODeNd2p8IOiLvPJXlY/export?format=csv';
