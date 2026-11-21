/**
 * Countries builders have registered from for Geek Room's global hackathons.
 * Coordinates are approximate (capital or main tech hub) and only used to place map pins.
 */
export const continents = ["Asia", "Europe", "Africa", "North America", "South America", "Oceania"] as const;
export type Continent = (typeof continents)[number];

export type Country = { name: string; continent: Continent; lat: number; lng: number };

/** Home base: shown as the origin of the arcs, not counted among the countries below */
export const home = { name: "India", lat: 28.6, lng: 77.2 };

export const countries: Country[] = [
  // Asia
  { name: "Philippines", continent: "Asia", lat: 14.6, lng: 121.0 },
  { name: "Malaysia", continent: "Asia", lat: 3.1, lng: 101.7 },
  { name: "Indonesia", continent: "Asia", lat: -6.2, lng: 106.8 },
  { name: "Singapore", continent: "Asia", lat: 1.35, lng: 103.8 },
  { name: "Japan", continent: "Asia", lat: 35.7, lng: 139.7 },
  { name: "South Korea", continent: "Asia", lat: 37.6, lng: 127.0 },
  { name: "China", continent: "Asia", lat: 39.9, lng: 116.4 },
  { name: "Hong Kong", continent: "Asia", lat: 22.3, lng: 114.2 },
  { name: "Vietnam", continent: "Asia", lat: 21.0, lng: 105.8 },
  { name: "Thailand", continent: "Asia", lat: 13.8, lng: 100.5 },
  { name: "Saudi Arabia", continent: "Asia", lat: 24.7, lng: 46.7 },
  { name: "UAE", continent: "Asia", lat: 25.2, lng: 55.3 },
  { name: "Qatar", continent: "Asia", lat: 25.3, lng: 51.5 },
  { name: "Bahrain", continent: "Asia", lat: 26.2, lng: 50.6 },
  { name: "Jordan", continent: "Asia", lat: 31.9, lng: 35.9 },
  { name: "Lebanon", continent: "Asia", lat: 33.9, lng: 35.5 },
  { name: "Israel", continent: "Asia", lat: 32.1, lng: 34.8 },
  { name: "Iraq", continent: "Asia", lat: 33.3, lng: 44.4 },
  { name: "Syria", continent: "Asia", lat: 33.5, lng: 36.3 },
  { name: "Turkey", continent: "Asia", lat: 41.0, lng: 29.0 },
  { name: "Azerbaijan", continent: "Asia", lat: 40.4, lng: 49.9 },
  { name: "Uzbekistan", continent: "Asia", lat: 41.3, lng: 69.3 },
  { name: "Kyrgyzstan", continent: "Asia", lat: 42.9, lng: 74.6 },
  { name: "Pakistan", continent: "Asia", lat: 33.7, lng: 73.1 },
  { name: "Bangladesh", continent: "Asia", lat: 23.8, lng: 90.4 },
  { name: "Sri Lanka", continent: "Asia", lat: 6.9, lng: 79.9 },
  { name: "Nepal", continent: "Asia", lat: 27.7, lng: 85.3 },
  // Europe
  { name: "United Kingdom", continent: "Europe", lat: 51.5, lng: -0.1 },
  { name: "Ireland", continent: "Europe", lat: 53.3, lng: -6.3 },
  { name: "France", continent: "Europe", lat: 48.9, lng: 2.4 },
  { name: "Spain", continent: "Europe", lat: 40.4, lng: -3.7 },
  { name: "Italy", continent: "Europe", lat: 41.9, lng: 12.5 },
  { name: "Belgium", continent: "Europe", lat: 50.8, lng: 4.4 },
  { name: "Austria", continent: "Europe", lat: 48.2, lng: 16.4 },
  { name: "Sweden", continent: "Europe", lat: 59.3, lng: 18.1 },
  { name: "Iceland", continent: "Europe", lat: 64.1, lng: -21.9 },
  { name: "Poland", continent: "Europe", lat: 52.2, lng: 21.0 },
  { name: "Romania", continent: "Europe", lat: 44.4, lng: 26.1 },
  { name: "Ukraine", continent: "Europe", lat: 50.5, lng: 30.5 },
  { name: "Russia", continent: "Europe", lat: 55.8, lng: 37.6 },
  { name: "Kosovo", continent: "Europe", lat: 42.7, lng: 21.2 },
  // Africa
  { name: "Nigeria", continent: "Africa", lat: 6.5, lng: 3.4 },
  { name: "Ghana", continent: "Africa", lat: 5.6, lng: -0.2 },
  { name: "Kenya", continent: "Africa", lat: -1.3, lng: 36.8 },
  { name: "Egypt", continent: "Africa", lat: 30.0, lng: 31.2 },
  { name: "South Africa", continent: "Africa", lat: -26.2, lng: 28.0 },
  { name: "Ethiopia", continent: "Africa", lat: 9.0, lng: 38.7 },
  { name: "Uganda", continent: "Africa", lat: 0.3, lng: 32.6 },
  { name: "Cameroon", continent: "Africa", lat: 3.9, lng: 11.5 },
  { name: "Tunisia", continent: "Africa", lat: 36.8, lng: 10.2 },
  { name: "Algeria", continent: "Africa", lat: 36.8, lng: 3.1 },
  { name: "Togo", continent: "Africa", lat: 6.1, lng: 1.2 },
  { name: "DR Congo", continent: "Africa", lat: -4.3, lng: 15.3 },
  // North America
  { name: "United States", continent: "North America", lat: 37.8, lng: -122.4 },
  { name: "Canada", continent: "North America", lat: 43.7, lng: -79.4 },
  { name: "Nicaragua", continent: "North America", lat: 12.1, lng: -86.3 },
  { name: "St Kitts & Nevis", continent: "North America", lat: 17.3, lng: -62.7 },
  // South America
  { name: "Brazil", continent: "South America", lat: -23.6, lng: -46.6 },
  { name: "Argentina", continent: "South America", lat: -34.6, lng: -58.4 },
  { name: "Chile", continent: "South America", lat: -33.4, lng: -70.7 },
  { name: "Colombia", continent: "South America", lat: 4.7, lng: -74.1 },
  { name: "Peru", continent: "South America", lat: -12.0, lng: -77.0 },
  { name: "Bolivia", continent: "South America", lat: -16.5, lng: -68.1 },
  // Oceania
  { name: "Australia", continent: "Oceania", lat: -33.9, lng: 151.2 },
];
