import { useQuery } from "@tanstack/react-query";
import { Info } from "lucide-react";
import { csvList, toggleCsv } from "@/lib/csv";
import { Badge } from "@/components/ui/Badge";
import { Banner } from "@/components/ui/Banner";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/Dialog";
import { PageHeader } from "@/components/ui/PageHeader";
import { TabLink, TabList } from "@/components/ui/Tabs";
import { athensCompaniesQueryOptions, naceCategoriesQueryOptions, rotterdamCompaniesQueryOptions } from "./api";
import { ABOUT_VISUALISATION, CITIES, CITY_CONFIG, type Year } from "./cities";
import { CompaniesMap } from "./CompaniesMap";
import { DataFilters } from "./DataFilters";
import type { DataSearch } from "./search";

interface DataPageProps {
  search: DataSearch;
  onChange: (patch: Partial<DataSearch>) => void;
}

/**
 * Where the textile industry actually is, city by city, from the public registers the
 * project mapped. One page: the city is a tab, and everything the map shows is in the
 * URL, so a filtered view can be sent to someone.
 */
export function DataPage({ search, onChange }: DataPageProps) {
  const city = CITY_CONFIG[search.city ?? "rotterdam"];
  const selected = csvList(search.cats);
  const year = (search.year ?? 2022) as Year;
  const hexbin = search.hexbin ?? false;
  const secondary = search.secondary ?? false;

  const categoriesQuery = useQuery(naceCategoriesQueryOptions);
  const rotterdam = useQuery({ ...rotterdamCompaniesQueryOptions(year, selected), enabled: city.key === "rotterdam" && selected.length > 0 });
  const athens = useQuery({ ...athensCompaniesQueryOptions(selected, secondary), enabled: city.key === "athens" && selected.length > 0 });

  const active = city.key === "rotterdam" ? rotterdam : athens;
  const companies = active.data?.data ?? [];
  const total = active.data?.meta.total_count ?? 0;

  return (
    <>
      <PageHeader
        title="Data"
        lede="Where the textile and clothing industry actually sits in the pilot cities, drawn from their public business registers."
        actions={
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Info className="size-4" />
                About the data
              </Button>
            </DialogTrigger>
            <DialogContent title={`About the ${city.label} data`} description={`Source: ${city.source}.`}>
              <div className="space-y-5">
                {[...city.about, ABOUT_VISUALISATION].map((section) => (
                  <div key={section.title}>
                    <h3 className="text-fx-body font-bold text-fx-ink">{section.title}</h3>
                    <p className="mt-1 text-fx-small text-fx-ink2">{section.body}</p>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      <TabList label="City" className="mt-8">
        {CITIES.map((key) => (
          <TabLink
            key={key}
            from="/data"
            to="/data"
            search={(prev) => ({ ...prev, city: key, cats: undefined })}
            active={city.key === key}
            resetScroll={false}
          >
            {CITY_CONFIG[key].label}
          </TabLink>
        ))}
      </TabList>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Badge tone={city.tone}>{city.place}</Badge>
        <Badge tone="slate">{city.source}</Badge>
        {city.years && <Badge tone="slate">{year}</Badge>}
        <p className="text-fx-small text-fx-ink2">
          {selected.length === 0
            ? "No activity selected yet"
            : active.isPending
              ? "Loading…"
              : `${total.toLocaleString()} business${total === 1 ? "" : "es"}`}
        </p>
      </div>

      {active.isError ? (
        <Banner tone="danger" className="mt-6">This city's data could not be loaded. Try again in a moment.</Banner>
      ) : (
        <div className="mt-6 grid gap-5 lg:grid-cols-[19rem_minmax(0,1fr)]">
          <aside aria-label="Filters">
            <DataFilters
              city={city}
              categories={categoriesQuery.data ?? []}
              selected={selected}
              year={year}
              hexbin={hexbin}
              secondary={secondary}
              onToggleCategory={(slug) => onChange({ cats: toggleCsv(search.cats, slug) })}
              onClear={() => onChange({ cats: undefined })}
              onChange={onChange}
            />
          </aside>

          <Card className="h-[32rem] overflow-hidden p-0 lg:h-[calc(100vh-22rem)] lg:min-h-[32rem]">
            <CompaniesMap
              key={city.key}
              city={city}
              companies={companies}
              categories={categoriesQuery.data ?? []}
              selected={selected}
              hexbin={hexbin}
              loading={active.isFetching}
            />
          </Card>
        </div>
      )}
    </>
  );
}
