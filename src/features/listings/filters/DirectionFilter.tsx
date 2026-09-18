import { PillLink } from "@/components/ui/Pill";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { DIRECTIONS, DIRECTION_META, ONE_OFF } from "../directions";
import type { MarketplaceSearch } from "../search";

/**
 * The two questions that decide whether a listing is any use to you: is it offered or
 * wanted, and is it a one-off. They sit together on their own ground because they read
 * as one question about the shape of the exchange, not as two more filters in the list.
 */
export function DirectionFilter({ search }: { search: MarketplaceSearch }) {
  const { direction, one_off } = search;

  return (
    <div className="space-y-5 rounded-fx-lg bg-fx-panel p-4">
      <div>
        <Eyebrow className="mb-3">Offered or wanted</Eyebrow>
        <div className="flex flex-wrap gap-2">
          <PillLink to="/marketplace" search={(prev) => ({ ...prev, direction: undefined })} active={!direction} resetScroll={false}>
            Either
          </PillLink>
          {DIRECTIONS.map((value) => (
            <PillLink
              key={value}
              to="/marketplace"
              search={(prev) => ({ ...prev, direction: direction === value ? undefined : value })}
              active={direction === value}
              tone={DIRECTION_META[value].tone}
              resetScroll={false}
            >
              {DIRECTION_META[value].filter}
            </PillLink>
          ))}
        </div>
      </div>

      <div>
        <Eyebrow className="mb-3">Timing</Eyebrow>
        <div className="flex flex-wrap gap-2">
          <PillLink to="/marketplace" search={(prev) => ({ ...prev, one_off: undefined })} active={one_off === undefined} resetScroll={false}>
            Any
          </PillLink>
          <PillLink
            to="/marketplace"
            search={(prev) => ({ ...prev, one_off: one_off === true ? undefined : true })}
            active={one_off === true}
            resetScroll={false}
          >
            {ONE_OFF.badge}
          </PillLink>
          <PillLink
            to="/marketplace"
            search={(prev) => ({ ...prev, one_off: one_off === false ? undefined : false })}
            active={one_off === false}
            resetScroll={false}
          >
            Ongoing
          </PillLink>
        </div>
      </div>
    </div>
  );
}
