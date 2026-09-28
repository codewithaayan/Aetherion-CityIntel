"use client";

import React from "react";
import type { Area } from "@/types/area";
import type { LayerName, MapLayer } from "@/types/risk";
import { UrbanMap } from "./UrbanMap";

export interface MapPlaceholderProps {
  activeLayer?: LayerName;
  selectedArea?: Area;
  layer?: MapLayer | null;
  layerLoading?: boolean;
  layerError?: string | null;
  heightClassName?: string;
  gridMinimized?: boolean;
  onGridMinimizeChange?: (minimized: boolean) => void;
}

export function MapPlaceholder({
  activeLayer = "heat",
  selectedArea,
  layer,
  layerLoading = false,
  layerError,
  heightClassName = "h-[580px]",
  gridMinimized = false,
  onGridMinimizeChange,
}: MapPlaceholderProps) {
  return (
    <UrbanMap
      activeLayer={activeLayer}
      selectedArea={selectedArea}
      layer={layer}
      layerLoading={layerLoading}
      layerError={layerError}
      heightClassName={heightClassName}
      initialGridMinimized={gridMinimized}
      onGridMinimizeChange={onGridMinimizeChange}
    />
  );
}
