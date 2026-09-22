export type GeoJSONGeometry = {
  type: string;
  coordinates?: unknown;
  geometries?: GeoJSONGeometry[];
};

export interface City {
  id: string;
  name: string;
  country: string;
  geometry: GeoJSONGeometry | null;
}

export interface Area {
  id: string;
  cityId: string;
  name: string;
  geometry: GeoJSONGeometry | null;
  population: number | null;
}
