import { queryOptions } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { networkKey } from "./api";

/** What the API sends: a node per followed organisation, a link per relation. */
export interface GraphPayload {
  nodes: {
    /** The CRM record's id — what the sheet is opened with. */
    id: string;
    organization_id: string;
    name: string;
    kind: string | null;
    image_url: string | null;
    number_of_workers: number | null;
    economic_health: string;
  }[];
  links: {
    source: string;
    target: string;
    relation_type: string;
    /** `actual` is declared, `potential` is a matchmaking suggestion. */
    kind: string;
  }[];
}

/** A node as the force layout uses it, keyed the way the links reference it. */
export interface GraphNode {
  /** The organisation's id: links point at organisations, not at CRM records. */
  id: string;
  recordId: string;
  name: string;
  kind: string | null;
  workers: number | null;
  health: string;
  x?: number;
  y?: number;
}

export interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
  relation_type: string;
  kind: string;
}

export const networkGraphQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: [...networkKey(slug), "graph"],
    queryFn: () => api.get<GraphPayload>(`/networks/${slug}/graph`),
  });

/**
 * The payload keys nodes by CRM record but links by organisation, so the nodes
 * are re-keyed on the organisation and any link pointing outside the set is
 * dropped — the layout throws on an unknown endpoint.
 */
export function toGraph(payload: GraphPayload | undefined): { nodes: GraphNode[]; links: GraphLink[] } {
  if (!payload) return { nodes: [], links: [] };

  const nodes: GraphNode[] = payload.nodes.map((node) => ({
    id: node.organization_id,
    recordId: node.id,
    name: node.name,
    kind: node.kind,
    workers: node.number_of_workers,
    health: node.economic_health,
  }));

  const known = new Set(nodes.map((node) => node.id));
  const links = payload.links.filter((link) => known.has(link.source) && known.has(link.target));

  return { nodes, links };
}

/** Node size from the workforce — a square-root scale, clamped so nothing swamps the canvas. */
export function nodeRadius(workers: number | null): number {
  if (!workers || workers <= 0) return 5;
  return Math.min(16, 5 + Math.sqrt(workers));
}
