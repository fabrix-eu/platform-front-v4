import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import ForceGraph2D from "react-force-graph-2d";
import { token } from "@/features/explore/map/mapTokens";
import { Banner } from "@/components/ui/Banner";
import { relationLabel } from "@/features/organizations/relations";
import { networkGraphQueryOptions, nodeRadius, toGraph, type GraphLink, type GraphNode } from "./graph";
import { HEALTH_LABELS } from "./types";

/** Same reading as the map: the colour is the health the facilitator set. */
function healthColour(health: string): string {
  switch (health) {
    case "excellent":
    case "good":
      return token("--color-fx-green", "#2a9d63");
    case "warning":
      return token("--color-fx-amber", "#c07d15");
    case "critical":
      return token("--color-fx-rose", "#cb4a86");
    default:
      return token("--color-fx-line2", "#dedce4");
  }
}

const endpointId = (end: string | GraphNode): string => (typeof end === "object" ? end.id : end);

export function NetworkGraph({ networkSlug }: { networkSlug: string }) {
  const navigate = useNavigate();
  const box = useRef<HTMLDivElement>(null);
  const fitted = useRef(false);
  // Ephemeral: the canvas needs pixel dimensions, and what the pointer is over.
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [hovered, setHovered] = useState<GraphNode | null>(null);

  const query = useQuery(networkGraphQueryOptions(networkSlug));
  const data = useMemo(() => toGraph(query.data), [query.data]);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect;
      if (rect) setSize({ width: rect.width, height: rect.height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  /** Hovering one organisation dims everything it has no relation with. */
  const lit = useMemo(() => {
    if (!hovered) return null;
    const ids = new Set<string>([hovered.id]);
    for (const link of data.links) {
      const from = endpointId(link.source);
      const to = endpointId(link.target);
      if (from === hovered.id) ids.add(to);
      if (to === hovered.id) ids.add(from);
    }
    return ids;
  }, [hovered, data.links]);

  const ink = token("--color-fx-ink", "#1a1a22");
  const line = token("--color-fx-emphasis", "#554cc4");
  const paper = token("--color-fx-paper", "#ffffff");

  return (
    <div ref={box} className="relative h-full w-full bg-fx-paper">
      {query.isPending && <p className="absolute inset-0 grid place-items-center text-fx-small text-fx-muted">Loading the graph…</p>}
      {query.isError && <Banner tone="danger" className="m-4">The graph could not be loaded.</Banner>}
      {!query.isPending && !query.isError && data.nodes.length === 0 && (
        <p className="absolute inset-0 grid place-items-center text-fx-body text-fx-ink2">
          Nothing to draw yet — follow a few organisations first.
        </p>
      )}

      {size.width > 0 && data.nodes.length > 0 && (
        <ForceGraph2D
          width={size.width}
          height={size.height}
          graphData={data}
          backgroundColor={paper}
          nodeRelSize={1}
          nodeVal={(node: GraphNode) => nodeRadius(node.workers) ** 2}
          nodeLabel={() => ""}
          cooldownTicks={120}
          d3VelocityDecay={0.35}
          onEngineStop={() => {
            if (fitted.current) return;
            fitted.current = true;
          }}
          onNodeHover={(node: GraphNode | null) => setHovered(node)}
          onNodeClick={(node: GraphNode) =>
            navigate({
              to: "/facilitator/$networkSlug/organizations/$recordId",
              params: { networkSlug, recordId: node.recordId },
            })
          }
          nodeCanvasObject={(node: GraphNode, ctx: CanvasRenderingContext2D, scale: number) => {
            const radius = nodeRadius(node.workers);
            const dimmed = lit ? !lit.has(node.id) : false;

            ctx.globalAlpha = dimmed ? 0.15 : 1;
            ctx.beginPath();
            ctx.arc(node.x ?? 0, node.y ?? 0, radius, 0, 2 * Math.PI);
            ctx.fillStyle = healthColour(node.health);
            ctx.fill();
            ctx.lineWidth = 1;
            ctx.strokeStyle = paper;
            ctx.stroke();

            // The name only once it can be read, or when the hover lights it.
            if (scale > 1.4 || (lit && lit.has(node.id))) {
              const fontSize = Math.max(10 / scale, 2.5);
              ctx.font = `${fontSize}px "Plus Jakarta Sans", sans-serif`;
              ctx.textAlign = "center";
              ctx.textBaseline = "top";
              ctx.fillStyle = ink;
              ctx.fillText(node.name, node.x ?? 0, (node.y ?? 0) + radius + 1.5);
            }
            ctx.globalAlpha = 1;
          }}
          linkColor={(link: GraphLink) => {
            if (!lit) return line;
            return lit.has(endpointId(link.source)) && lit.has(endpointId(link.target)) ? line : `${line}20`;
          }}
          linkWidth={(link: GraphLink) => (link.kind === "potential" ? 1 : 1.6)}
          linkLineDash={(link: GraphLink) => (link.kind === "potential" ? [3, 3] : null)}
        />
      )}

      {hovered && (
        <div className="pointer-events-none absolute top-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-fx border border-fx-line bg-fx-paper/95 px-3 py-1.5 text-fx-small shadow-sm backdrop-blur">
          <span aria-hidden className="size-2.5 shrink-0 rounded-full" style={{ background: healthColour(hovered.health) }} />
          <span className="font-bold text-fx-ink">{hovered.name}</span>
          {hovered.workers != null && <span className="text-fx-label text-fx-muted">{hovered.workers} workers</span>}
          {hovered.health !== "unknown" && <span className="text-fx-label text-fx-muted">{HEALTH_LABELS[hovered.health]}</span>}
        </div>
      )}

      <div className="absolute bottom-3 left-3 z-10 max-w-64 rounded-fx border border-fx-line bg-fx-paper/95 px-3 py-2.5 text-fx-small shadow-sm backdrop-blur">
        <p className="mb-1.5 font-fx-display text-fx-label text-fx-muted uppercase">Relations</p>
        <p className="text-fx-ink2">{relationLabel("input_output")}, {relationLabel("services")}, {relationLabel("rnd")}…</p>
        <p className="mt-1.5 flex items-center gap-2 border-t border-fx-line pt-1.5 text-fx-label text-fx-muted">
          <span aria-hidden className="w-5 border-t border-dashed border-fx-line2" />
          Suggested, not declared
        </p>
      </div>
    </div>
  );
}

export default NetworkGraph;
