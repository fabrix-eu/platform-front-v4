import { useMemo, useState } from "react";
import type { ResolvedLocation } from "@/features/explore/location";
import { PointsMap, type MapPoint } from "@/features/explore/map/PointsMap";
import type { Listing } from "../types";
import { listingPoints, otherColor, typeColors } from "./listingPoints";
import { MapLegend, MapSelection } from "./MapOverlays";

/** The marketplace on a map: one pill per listing, coloured like its badge. */
export function ListingsMap({ listings, location }: { listings: Listing[]; location: ResolvedLocation }) {
  // Ephemeral: the marker someone clicked.
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const points = useMemo(() => {
    const colors = typeColors();
    const fallback = otherColor();
    return listingPoints(listings).map<MapPoint>(({ listing, lon, lat }) => ({
      id: listing.id,
      lon,
      lat,
      color: colors[listing.listing_type] ?? fallback,
      label: listing.title,
    }));
  }, [listings]);

  const selected = listings.find((listing) => listing.id === selectedId) ?? null;

  return (
    <PointsMap
      points={points}
      location={location}
      selectedId={selectedId}
      onSelect={setSelectedId}
      legend={<MapLegend />}
      emptyTitle="Nothing to show on the map"
      emptyDescription="These listings have no address yet — their organisations have not placed themselves on the map."
    >
      {selected && <MapSelection listing={selected} onClose={() => setSelectedId(null)} />}
    </PointsMap>
  );
}
