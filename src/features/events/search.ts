import { z } from "zod";

// Everything the events page shows is in the URL: a filtered view can be shared.
export const eventsSearchSchema = z.object({
  search: z.string().optional(),
  country: z.string().optional(),
  /** "all" = the visitor cleared the default "near my organisation" filter. */
  near: z.literal("all").optional(),
  radius: z.number().optional(),
  /** Upcoming first by default; "past" looks back instead. */
  when: z.enum(["upcoming", "past"]).optional(),
  view: z.enum(["cards", "list", "map"]).optional(),
});

export type EventsSearch = z.infer<typeof eventsSearchSchema>;
