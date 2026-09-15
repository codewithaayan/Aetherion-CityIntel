-- Initial schema only. Run explicitly against a new team database.
-- Technical choices and unresolved data semantics are in docs/backend-contract.md.
CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE cities (
    id text PRIMARY KEY,
    name text NOT NULL,
    country text NOT NULL,
    geometry geometry(Geometry, 4326) CHECK (ST_IsValid(geometry))
);

CREATE TABLE areas (
    id text PRIMARY KEY,
    city_id text NOT NULL REFERENCES cities(id),
    name text NOT NULL,
    geometry geometry(Geometry, 4326) CHECK (ST_IsValid(geometry)),
    population double precision
);

CREATE TABLE grid_cells (
    id text PRIMARY KEY,
    area_id text NOT NULL REFERENCES areas(id),
    geometry geometry(Geometry, 4326) CHECK (ST_IsValid(geometry)),
    centroid_lat double precision,
    centroid_lon double precision
);

CREATE TABLE environmental_data (
    id text PRIMARY KEY,
    grid_cell_id text NOT NULL REFERENCES grid_cells(id),
    timestamp timestamptz NOT NULL,
    temperature double precision,
    ndvi double precision,
    pm25 double precision,
    pm10 double precision,
    rainfall double precision,
    elevation double precision,
    slope double precision,
    population double precision,
    road_density double precision,
    green_percentage double precision,
    UNIQUE (grid_cell_id, timestamp)
);

CREATE TABLE risk_scores (
    id text PRIMARY KEY,
    grid_cell_id text NOT NULL REFERENCES grid_cells(id),
    timestamp timestamptz NOT NULL,
    heat_score double precision,
    air_score double precision,
    flood_score double precision,
    green_score double precision,
    mobility_score double precision,
    population_exposure_score double precision,
    overall_score double precision,
    UNIQUE (grid_cell_id, timestamp)
);

CREATE TABLE scenarios (
    id text PRIMARY KEY,
    area_id text NOT NULL REFERENCES areas(id),
    created_at timestamptz NOT NULL,
    tree_change double precision,
    drainage_change double precision,
    cool_roof_change double precision,
    traffic_change double precision,
    projected_heat double precision,
    projected_flood double precision,
    projected_green double precision,
    projected_overall double precision
);

CREATE INDEX areas_city_id_idx ON areas(city_id);
CREATE INDEX grid_cells_area_id_idx ON grid_cells(area_id);
CREATE INDEX scenarios_area_id_idx ON scenarios(area_id);
CREATE INDEX cities_geometry_idx ON cities USING gist(geometry);
CREATE INDEX areas_geometry_idx ON areas USING gist(geometry);
CREATE INDEX grid_cells_geometry_idx ON grid_cells USING gist(geometry);
