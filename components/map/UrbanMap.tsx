"use client";

import React, { useState, useMemo, useRef, useCallback } from "react";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Minimize2,
  Grid,
  Flame,
  Trees,
  CloudRain,
  EyeOff,
  Crosshair,
  Sparkles,
} from "lucide-react";
import type { Area, GeoJSONGeometry } from "@/types/area";
import type { LayerName, MapFeature, MapLayer } from "@/types/risk";
import { cn, formatNumber } from "@/lib/utils";

export interface IntelligenceHotspot {
  id: string;
  name: string;
  type: "thermal" | "flood" | "canopy_deficit";
  cellId: string;
  coordinates: [number, number]; // [lon, lat]
  title: string;
  description: string;
  score: number;
}

export interface SimulationAdjustment {
  treeChange: number; // 0 to 50
  coolRoofChange: number; // 0 to 60
  drainageChange: number; // 0 to 50
  trafficChange: number; // 0 to 40
}

export interface UrbanMapProps {
  activeLayer?: LayerName | "intelligence" | "simulator";
  selectedArea?: Area | null;
  layer?: MapLayer | null;
  layerLoading?: boolean;
  layerError?: string | null;
  heightClassName?: string;
  mode?: "explore" | "intelligence" | "simulator";
  initialGridMinimized?: boolean;
  onGridMinimizeChange?: (minimized: boolean) => void;
  hotspots?: IntelligenceHotspot[];
  onSelectHotspot?: (hotspot: IntelligenceHotspot) => void;
  selectedHotspotId?: string | null;
  simulationAdjustment?: SimulationAdjustment;
  showComparison?: boolean;
  onSelectCell?: (feature: MapFeature | null) => void;
}

interface BBox {
  minLon: number;
  minLat: number;
  maxLon: number;
  maxLat: number;
}

function mercatorY(lat: number): number {
  const rad = (lat * Math.PI) / 180;
  return Math.log(Math.tan(Math.PI / 4 + rad / 2));
}

export function UrbanMap({
  activeLayer = "heat",
  selectedArea,
  layer,
  layerLoading = false,
  heightClassName = "h-[540px]",
  mode = "explore",
  initialGridMinimized = false,
  onGridMinimizeChange,
  hotspots = [],
  onSelectHotspot,
  selectedHotspotId,
  simulationAdjustment,
  onSelectCell,
}: UrbanMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [gridMinimized, setGridMinimized] = useState(initialGridMinimized);
  const [hoveredCell, setHoveredCell] = useState<MapFeature | null>(null);
  const [selectedCell, setSelectedCell] = useState<MapFeature | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  // Synchronize area changes without effect-induced render cascades (React 19 pattern)
  const [prevAreaId, setPrevAreaId] = useState(selectedArea?.id);
  if (selectedArea?.id !== prevAreaId) {
    setPrevAreaId(selectedArea?.id);
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setSelectedCell(null);
    setHoveredCell(null);
  }

  const toggleGridMinimize = useCallback(() => {
    setGridMinimized((prev) => {
      const next = !prev;
      onGridMinimizeChange?.(next);
      return next;
    });
  }, [onGridMinimizeChange]);

  // Compute bounding box from selectedArea geometry or layer features
  const bbox: BBox = useMemo(() => {
    const coords: Array<[number, number]> = [];

    const extractCoords = (geom: GeoJSONGeometry | null | undefined) => {
      if (!geom || !geom.coordinates) return;
      const traverse = (item: unknown) => {
        if (Array.isArray(item)) {
          if (
            item.length >= 2 &&
            typeof item[0] === "number" &&
            typeof item[1] === "number"
          ) {
            coords.push([item[0], item[1]]);
          } else {
            item.forEach(traverse);
          }
        }
      };
      traverse(geom.coordinates);
    };

    if (selectedArea?.geometry) {
      extractCoords(selectedArea.geometry);
    }

    if (layer?.features) {
      layer.features.forEach((f) => extractCoords(f.geometry));
    }

    if (coords.length === 0) {
      return { minLon: 66.98, minLat: 24.82, maxLon: 67.12, maxLat: 24.93 };
    }

    let minLon = Infinity;
    let minLat = Infinity;
    let maxLon = -Infinity;
    let maxLat = -Infinity;

    for (const [lon, lat] of coords) {
      if (lon < minLon) minLon = lon;
      if (lon > maxLon) maxLon = lon;
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
    }

    const lonPad = Math.max(0.005, (maxLon - minLon) * 0.12);
    const latPad = Math.max(0.005, (maxLat - minLat) * 0.12);

    return {
      minLon: minLon - lonPad,
      minLat: minLat - latPad,
      maxLon: maxLon + lonPad,
      maxLat: maxLat + latPad,
    };
  }, [selectedArea, layer]);

  const viewWidth = 1000;
  const viewHeight = 650;
  const padding = 50;

  const minMerc = useMemo(() => mercatorY(bbox.minLat), [bbox.minLat]);
  const maxMerc = useMemo(() => mercatorY(bbox.maxLat), [bbox.maxLat]);

  const project = useCallback(
    (lon: number, lat: number): [number, number] => {
      const lonSpan = bbox.maxLon - bbox.minLon || 0.01;
      const mercSpan = maxMerc - minMerc || 0.01;

      const normX = (lon - bbox.minLon) / lonSpan;
      const currentMerc = mercatorY(lat);
      const normY = (maxMerc - currentMerc) / mercSpan;

      const x = padding + normX * (viewWidth - 2 * padding);
      const y = padding + normY * (viewHeight - 2 * padding);
      return [x, y];
    },
    [bbox, minMerc, maxMerc]
  );

  const coordsToSvgPath = useCallback(
    (rings: unknown): string => {
      if (!Array.isArray(rings) || rings.length === 0) return "";
      const isMulti =
        Array.isArray(rings[0]) &&
        Array.isArray(rings[0][0]) &&
        Array.isArray(rings[0][0][0]);
      const polygonRings: Array<Array<[number, number]>> = isMulti
        ? (rings as unknown as Array<Array<Array<[number, number]>>>).flat()
        : (rings as unknown as Array<Array<[number, number]>>);

      return polygonRings
        .map((ring) => {
          if (!Array.isArray(ring) || ring.length === 0) return "";
          return (
            ring
              .map(([lon, lat], i) => {
                const [x, y] = project(lon, lat);
                return `${i === 0 ? "M" : "L"} ${x.toFixed(1)},${y.toFixed(1)}`;
              })
              .join(" ") + " Z"
          );
        })
        .join(" ");
    },
    [project]
  );

  // Mouse pan & tooltip positioning handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const clampedX = Math.min(e.clientX - rect.left + 15, rect.width - 275);
      const clampedY = Math.max(10, e.clientY - rect.top - 120);
      setTooltipPos({ x: clampedX, y: clampedY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.15 : 0.87;
    setZoom((z) => Math.min(5, Math.max(0.8, z * factor)));
  };

  // Color functions for choropleth mapping
  const getCellFill = useCallback(
    (feature: MapFeature) => {
      const props = (feature.properties ?? {}) as Record<string, unknown>;

      if (mode === "simulator" && simulationAdjustment) {
        const baseHeat = Number(props.heat_score ?? props.temperature ?? 70);
        const baseGreen = Number(props.green_score ?? 20);
        const baseFlood = Number(props.flood_score ?? 60);

        const heatDelta =
          simulationAdjustment.treeChange * 0.4 +
          simulationAdjustment.coolRoofChange * 0.35 +
          simulationAdjustment.trafficChange * 0.15;
        const floodDelta =
          simulationAdjustment.drainageChange * 0.5 + simulationAdjustment.treeChange * 0.2;
        const greenDelta = simulationAdjustment.treeChange * 0.9;

        const projectedHeat = Math.max(15, Math.round(baseHeat - heatDelta));
        const projectedFlood = Math.max(15, Math.round(baseFlood - floodDelta));
        const projectedGreen = Math.min(99, Math.round(baseGreen + greenDelta));

        if (activeLayer === "green") {
          return projectedGreen > 65
            ? "rgba(16, 185, 129, 0.75)"
            : projectedGreen > 40
            ? "rgba(52, 211, 153, 0.65)"
            : "rgba(120, 53, 15, 0.55)";
        }
        if (activeLayer === "flood") {
          return projectedFlood > 70
            ? "rgba(30, 64, 175, 0.85)"
            : projectedFlood > 45
            ? "rgba(14, 165, 233, 0.65)"
            : "rgba(6, 182, 212, 0.45)";
        }
        return projectedHeat > 80
          ? "rgba(220, 38, 38, 0.85)"
          : projectedHeat > 65
          ? "rgba(249, 115, 22, 0.75)"
          : projectedHeat > 50
          ? "rgba(234, 179, 8, 0.65)"
          : "rgba(34, 197, 94, 0.65)";
      }

      if (activeLayer === "green") {
        const score = Number(props.green_score ?? (Number(props.ndvi ?? 0) * 100));
        if (score >= 60) return "rgba(16, 185, 129, 0.75)";
        if (score >= 40) return "rgba(52, 211, 153, 0.6)";
        if (score >= 25) return "rgba(163, 230, 53, 0.5)";
        return "rgba(180, 83, 9, 0.55)";
      }

      if (activeLayer === "flood") {
        const score = Number(props.flood_score ?? 50);
        if (score >= 75) return "rgba(29, 78, 216, 0.85)";
        if (score >= 55) return "rgba(2, 132, 199, 0.7)";
        if (score >= 35) return "rgba(6, 182, 212, 0.55)";
        return "rgba(56, 189, 248, 0.35)";
      }

      const score = Number(props.heat_score ?? props.temperature ?? 60);
      if (score >= 80) return "rgba(220, 38, 38, 0.85)";
      if (score >= 65) return "rgba(239, 68, 68, 0.7)";
      if (score >= 50) return "rgba(245, 158, 11, 0.65)";
      if (score >= 35) return "rgba(234, 179, 8, 0.55)";
      return "rgba(34, 197, 94, 0.55)";
    },
    [activeLayer, mode, simulationAdjustment]
  );

  const getCellStroke = useCallback(
    (feature: MapFeature, isHovered: boolean, isSelected: boolean) => {
      if (isSelected) return "#06b6d4";
      if (isHovered) return "#ffffff";
      if (gridMinimized) return "rgba(6, 182, 212, 0.15)";
      return "rgba(15, 23, 42, 0.85)";
    },
    [gridMinimized]
  );

  const drawableFeatures = useMemo(() => {
    return (layer?.features ?? []).filter((f) => f.geometry !== null);
  }, [layer]);

  const areaBoundaryPath = useMemo(() => {
    if (!selectedArea?.geometry?.coordinates) return "";
    return coordsToSvgPath(selectedArea.geometry.coordinates);
  }, [selectedArea, coordsToSvgPath]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex w-full flex-col justify-between overflow-hidden rounded-2xl border border-cyan-500/25 bg-[#030713] select-none",
        heightClassName
      )}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => {
        handleMouseUp();
        setHoveredCell(null);
      }}
      onWheel={handleWheel}
    >
      <div className="absolute inset-0 pointer-events-none bg-grid-pattern opacity-30" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-950/20 via-[#030713]/80 to-[#02050e]" />

      {/* Top Map HUD Bar */}
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-2 p-3 sm:p-4 text-xs font-mono">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-slate-900/90 px-3 py-1.5 text-cyan-300 backdrop-blur-md shadow-lg shadow-black/40">
            {activeLayer === "heat" ? (
              <Flame className="h-3.5 w-3.5 text-red-400" />
            ) : activeLayer === "green" ? (
              <Trees className="h-3.5 w-3.5 text-emerald-400" />
            ) : activeLayer === "flood" ? (
              <CloudRain className="h-3.5 w-3.5 text-blue-400" />
            ) : (
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            )}
            <span className="font-bold tracking-wider uppercase">
              {mode === "simulator"
                ? "SIMULATION MATRIX"
                : mode === "intelligence"
                ? "SPATIAL AI INTELLIGENCE"
                : `${activeLayer.toUpperCase()} LAYER`}
            </span>
          </div>

          {/* Grid Minimize / Expand Toggle Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleGridMinimize();
            }}
            className={cn(
              "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all backdrop-blur-md",
              gridMinimized
                ? "border-amber-500/50 bg-amber-500/15 text-amber-300 hover:bg-amber-500/25"
                : "border-cyan-500/40 bg-slate-900/90 text-cyan-300 hover:bg-cyan-500/20"
            )}
            title={gridMinimized ? "Expand Grid Cells" : "Minimize Grid Overlay"}
          >
            {gridMinimized ? (
              <>
                <Maximize2 className="h-3.5 w-3.5" />
                <span>Expand Grid</span>
              </>
            ) : (
              <>
                <Minimize2 className="h-3.5 w-3.5" />
                <span>Minimize Grid</span>
              </>
            )}
          </button>
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-2">
          {layerLoading ? (
            <span className="flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-slate-900/90 px-2.5 py-1 text-[11px] text-cyan-400 animate-pulse">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
              Loading GeoJSON layer…
            </span>
          ) : drawableFeatures.length > 0 ? (
            <span className="hidden sm:flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-950/80 px-2.5 py-1 text-[11px] text-slate-400">
              <Grid className="h-3 w-3 text-cyan-400" />
              {gridMinimized ? "Grid minimized" : `${drawableFeatures.length} active grid cells`}
            </span>
          ) : null}

          {selectedArea && (
            <span className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-950/80 px-2.5 py-1 text-[11px] text-slate-300">
              <Crosshair className="h-3 w-3 text-emerald-400" />
              {selectedArea.name}
            </span>
          )}
        </div>
      </div>

      {/* Main Interactive SVG Map Viewport */}
      <div
        className={cn(
          "absolute inset-0 cursor-grab active:cursor-grabbing",
          isDragging && "cursor-grabbing"
        )}
      >
        <svg
          viewBox={`0 0 ${viewWidth} ${viewHeight}`}
          className="h-full w-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="areaGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.03" />
            </linearGradient>

            <filter id="cyanGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="hotspotGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <pattern id="diagHatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="8" stroke="#06b6d4" strokeWidth="0.75" strokeOpacity="0.12" />
            </pattern>
          </defs>

          <g
            transform={`translate(${pan.x + (viewWidth * (1 - zoom)) / 2}, ${
              pan.y + (viewHeight * (1 - zoom)) / 2
            }) scale(${zoom})`}
            style={{ transition: isDragging ? "none" : "transform 0.15s ease-out" }}
          >
            <g className="opacity-20 pointer-events-none">
              {[0.2, 0.4, 0.6, 0.8].map((ratio) => {
                const y = padding + ratio * (viewHeight - 2 * padding);
                const x = padding + ratio * (viewWidth - 2 * padding);
                return (
                  <React.Fragment key={ratio}>
                    <line x1={padding} y1={y} x2={viewWidth - padding} y2={y} stroke="#06b6d4" strokeDasharray="3 4" strokeWidth="0.75" />
                    <line x1={x} y1={padding} x2={x} y2={viewHeight - padding} stroke="#06b6d4" strokeDasharray="3 4" strokeWidth="0.75" />
                  </React.Fragment>
                );
              })}
            </g>

            {areaBoundaryPath && (
              <g>
                <path
                  d={areaBoundaryPath}
                  fill="url(#areaGlow)"
                  stroke="#06b6d4"
                  strokeWidth="2.5"
                  strokeOpacity="0.9"
                  strokeDasharray="8 4"
                  filter="url(#cyanGlow)"
                />
                <path d={areaBoundaryPath} fill="url(#diagHatch)" pointerEvents="none" />
              </g>
            )}

            {drawableFeatures.map((feature, i) => {
              const geom = feature.geometry;
              if (!geom?.coordinates) return null;
              const path = coordsToSvgPath(geom.coordinates);
              if (!path) return null;

              const isHovered = hoveredCell === feature;
              const isSelected = selectedCell === feature;
              const props = (feature.properties ?? {}) as Record<string, unknown>;

              return (
                <path
                  key={String(props.grid_cell_id ?? i)}
                  d={path}
                  fill={gridMinimized ? "transparent" : getCellFill(feature)}
                  fillOpacity={gridMinimized ? 0 : 0.85}
                  stroke={getCellStroke(feature, isHovered, isSelected)}
                  strokeWidth={isSelected ? 2.5 : isHovered ? 2 : gridMinimized ? 0.8 : 1.2}
                  strokeDasharray={gridMinimized ? "3 3" : undefined}
                  className="transition-colors duration-150 cursor-pointer"
                  onMouseEnter={() => setHoveredCell(feature)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCell(feature);
                    onSelectCell?.(feature);
                  }}
                />
              );
            })}

            {hotspots.map((spot) => {
              const [x, y] = project(spot.coordinates[0], spot.coordinates[1]);
              const isSelected = selectedHotspotId === spot.id;
              const color =
                spot.type === "thermal"
                  ? "#ef4444"
                  : spot.type === "flood"
                  ? "#3b82f6"
                  : "#10b981";

              return (
                <g
                  key={spot.id}
                  transform={`translate(${x}, ${y})`}
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectHotspot?.(spot);
                  }}
                >
                  <circle r={isSelected ? 16 : 11} fill={color} fillOpacity="0.25" filter="url(#hotspotGlow)">
                    <animate attributeName="r" values={isSelected ? "14;20;14" : "9;14;9"} dur="2.5s" repeatCount="indefinite" />
                  </circle>
                  <circle r={isSelected ? 8 : 6} fill={color} stroke="#ffffff" strokeWidth="2" />
                  <text
                    y={-14}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight="bold"
                    className="pointer-events-none drop-shadow-md"
                  >
                    {spot.name}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {gridMinimized && drawableFeatures.length > 0 && (
        <div className="absolute top-16 left-4 z-20 flex items-center gap-2 rounded-xl border border-amber-500/40 bg-slate-950/90 px-3 py-2 text-xs font-mono text-amber-300 shadow-xl backdrop-blur-md animate-in fade-in duration-200">
          <EyeOff className="h-4 w-4 text-amber-400 shrink-0" />
          <span>Grid overlay is minimized ({drawableFeatures.length} cells hidden)</span>
          <button
            type="button"
            onClick={toggleGridMinimize}
            className="ml-1 rounded-md bg-amber-500/20 px-2 py-0.5 text-[11px] font-bold text-amber-200 hover:bg-amber-500/30 transition-colors"
          >
            Restore Grid
          </button>
        </div>
      )}

      {hoveredCell && tooltipPos && (
        <div
          className="pointer-events-none absolute z-30 w-64 rounded-xl border border-cyan-500/40 bg-slate-950/95 p-3 font-mono text-xs shadow-2xl backdrop-blur-xl"
          style={{
            left: tooltipPos.x,
            top: tooltipPos.y,
          }}
        >
          {(() => {
            const p = (hoveredCell.properties ?? {}) as Record<string, unknown>;
            const cellId = String(p.grid_cell_id ?? "Cell");
            const temp = p.temperature !== undefined ? `${p.temperature}°C` : "—";
            const heatScore = p.heat_score !== undefined ? `${p.heat_score}/100` : "—";
            const ndvi = p.ndvi !== undefined ? `${p.ndvi}` : "—";
            const floodScore = p.flood_score !== undefined ? `${p.flood_score}/100` : "—";
            const pop = p.population !== undefined ? formatNumber(Number(p.population)) : "—";

            return (
              <div className="space-y-2">
                <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                  <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                    <Crosshair className="h-3 w-3 text-cyan-400" />
                    {cellId}
                  </span>
                  <span
                    className={cn(
                      "text-[9px] px-1.5 py-0.5 rounded font-bold uppercase",
                      Number(p.heat_score ?? 0) > 80 || Number(p.flood_score ?? 0) > 75
                        ? "bg-red-500/20 text-red-300 border border-red-500/40"
                        : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    )}
                  >
                    {String(p.vulnerability ?? "Active")}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                  <div>
                    <span className="text-[10px] text-slate-400 block">TEMPERATURE</span>
                    <span className="font-bold text-red-300">{temp}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">HEAT RISK</span>
                    <span className="font-bold text-white">{heatScore}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">VEGETATION (NDVI)</span>
                    <span className="font-bold text-emerald-300">{ndvi}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">FLOOD RISK</span>
                    <span className="font-bold text-blue-300">{floodScore}</span>
                  </div>
                  <div className="col-span-2 pt-1 border-t border-slate-900 flex justify-between text-[10px]">
                    <span className="text-slate-400">EST. POPULATION:</span>
                    <span className="font-bold text-cyan-200">{pop} residents</span>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {selectedCell && (
        <div className="absolute bottom-16 right-4 z-20 w-72 rounded-xl border border-cyan-500/50 bg-[#040817]/95 p-3.5 font-mono text-xs shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-2">
          {(() => {
            const p = (selectedCell.properties ?? {}) as Record<string, unknown>;
            return (
              <div className="space-y-2">
                <div className="flex items-center justify-between border-b border-cyan-500/30 pb-2">
                  <div className="flex items-center gap-1.5">
                    <Grid className="h-3.5 w-3.5 text-cyan-400" />
                    <span className="font-bold text-white">{String(p.grid_cell_id)}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedCell(null)}
                    className="text-slate-400 hover:text-white text-xs px-1.5 py-0.5 rounded bg-slate-800"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-[11px] text-slate-300">
                  Target spatial grid cell within {selectedArea?.name}.
                </p>
                <div className="grid grid-cols-2 gap-2 text-[11px] rounded-lg bg-slate-950/80 p-2 border border-slate-800">
                  <div>
                    <span className="text-[9px] text-slate-400">SURFACE HEAT</span>
                    <p className="text-red-400 font-bold">{p.temperature ?? "—"}°C</p>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400">CANOPY COVER</span>
                    <p className="text-emerald-400 font-bold">{p.green_percentage ?? "—"}%</p>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400">PRECIPITATION</span>
                    <p className="text-blue-400 font-bold">{p.rainfall ?? "—"} mm</p>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400">POPULATION</span>
                    <p className="text-cyan-300 font-bold">{formatNumber(Number(p.population ?? 0))}</p>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Floating Map Controls & Navigation Tools */}
      <div className="relative z-20 flex items-center justify-between p-3 sm:p-4 text-[11px] font-mono border-t border-slate-900 bg-[#030713]/90 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">LOW</span>
            <div
              className={cn(
                "h-2 w-20 sm:w-28 rounded-full",
                activeLayer === "heat"
                  ? "bg-gradient-to-r from-yellow-400 via-amber-500 to-red-600"
                  : activeLayer === "green"
                  ? "bg-gradient-to-r from-amber-800 via-lime-500 to-emerald-500"
                  : "bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-800"
              )}
            />
            <span className="text-slate-400">CRITICAL</span>
          </div>

          <span className="hidden sm:inline-block text-slate-500">|</span>
          <span className="hidden sm:inline-block text-slate-400">
            WGS84 EPSG:4326 • 500m Cells
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 p-1 rounded-xl backdrop-blur-md">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(5, z * 1.25))}
            className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-cyan-300 rounded-lg transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(0.8, z * 0.8))}
            className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-cyan-300 rounded-lg transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => {
              setZoom(1);
              setPan({ x: 0, y: 0 });
            }}
            className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-cyan-300 rounded-lg transition-colors"
            title="Reset Viewport"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={toggleGridMinimize}
            className={cn(
              "p-1.5 rounded-lg transition-colors",
              gridMinimized ? "text-amber-400 bg-amber-500/10" : "text-slate-400 hover:text-cyan-300 hover:bg-slate-800"
            )}
            title={gridMinimized ? "Restore Grid" : "Minimize Grid"}
          >
            <Grid className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
