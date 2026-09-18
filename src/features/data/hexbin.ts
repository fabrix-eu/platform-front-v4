/**
 * Aggregating points into hexagonal cells, so a city of thousands of businesses reads
 * as density rather than as a solid mass of overlapping dots.
 *
 * Ported from the previous front unchanged in its maths: axial hex coordinates, with
 * degrees converted to metres at the city's latitude so cells stay roughly regular.
 */

export interface HexPoint {
  latitude: number;
  longitude: number;
  name: string;
  categories: { slug: string }[];
}

export interface Hexbin {
  q: number;
  r: number;
  lat: number;
  lng: number;
  count: number;
  /** The first few names, for the popup — not the whole cell. */
  names: string[];
}

const METRES_PER_DEGREE_LAT = 111_320;

const metresPerDegreeLng = (lat: number) => METRES_PER_DEGREE_LAT * Math.cos((lat * Math.PI) / 180);

function toHex(lat: number, lng: number, radius: number): [number, number] {
  const x = lng * metresPerDegreeLng(lat);
  const y = lat * METRES_PER_DEGREE_LAT;

  const q = ((Math.sqrt(3) / 3) * x - (1 / 3) * y) / radius;
  const r = ((2 / 3) * y) / radius;

  return roundHex(q, r);
}

// Cube rounding: rounding q and r on their own would land points in the wrong cell
// near the edges, so the axis that moved furthest is the one recomputed.
function roundHex(q: number, r: number): [number, number] {
  const s = -q - r;
  let rq = Math.round(q);
  let rr = Math.round(r);
  const rs = Math.round(s);

  const dq = Math.abs(rq - q);
  const dr = Math.abs(rr - r);
  const ds = Math.abs(rs - s);

  if (dq > dr && dq > ds) {
    rq = -rr - rs;
  } else if (dr > ds) {
    rr = -rq - rs;
  }

  return [rq, rr];
}

function toLatLng(q: number, r: number, radius: number, referenceLat: number): [number, number] {
  const x = radius * (Math.sqrt(3) * q + (Math.sqrt(3) / 2) * r);
  const y = radius * ((3 / 2) * r);

  return [y / METRES_PER_DEGREE_LAT, x / metresPerDegreeLng(referenceLat)];
}

/** The cells of one category, keeping only those dense enough to mean something. */
export function aggregateToHexbins(
  points: HexPoint[],
  { radius, referenceLat, categorySlug, minimum = 5 }: {
    radius: number;
    referenceLat: number;
    categorySlug: string;
    minimum?: number;
  },
): Hexbin[] {
  const cells = new Map<string, Hexbin>();

  for (const point of points) {
    if (!point.categories.some((category) => category.slug === categorySlug)) continue;

    const [q, r] = toHex(point.latitude, point.longitude, radius);
    const key = `${q},${r}`;

    let cell = cells.get(key);
    if (!cell) {
      const [lat, lng] = toLatLng(q, r, radius, referenceLat);
      cell = { q, r, lat, lng, count: 0, names: [] };
      cells.set(key, cell);
    }

    cell.count += 1;
    if (cell.names.length < 5) cell.names.push(point.name);
  }

  return Array.from(cells.values()).filter((cell) => cell.count >= minimum);
}
