export const DATA_SOURCES = [
  { name: "NASA Earth Observation", agency: "NASA EOSDIS", description: "Multispectral radiance, land surface temperature, and atmospheric profile data.", resolution: "1km / Daily pass", badge: "Thermal & Climate", icon: "Satellite" },
  { name: "Landsat 8 & 9", agency: "USGS / NASA", description: "Thermal Infrared Sensor and multispectral satellite observations.", resolution: "30m - 100m / 16-day cycle", badge: "Surface Temperature", icon: "Globe" },
  { name: "Sentinel-2", agency: "European Space Agency", description: "Multispectral imagery available for vegetation analysis by the data team.", resolution: "10m - 20m / 5-day cycle", badge: "Vegetation & Canopy", icon: "Layers" },
  { name: "NASA GPM", agency: "NASA / JAXA", description: "Global Precipitation Measurement catalog and downloadable products.", resolution: "Product selection required", badge: "Precipitation & Flood", icon: "CloudRain" },
  { name: "Open-Meteo", agency: "Open-Meteo", description: "Weather and air-quality API responses passed raw into the processing pipeline.", resolution: "Depends on selected model", badge: "Weather & Air", icon: "Wind" },
  { name: "WorldPop", agency: "University of Southampton", description: "Downloadable gridded population datasets selected by the data team.", resolution: "Dataset selection required", badge: "Population", icon: "Users" },
  { name: "OpenStreetMap", agency: "OpenStreetMap contributors", description: "Raw OpenStreetMap responses for agreed geographic selections.", resolution: "Vector data", badge: "Urban Geography", icon: "MapPin" },
];

export const TEAM_MEMBERS = [
  { name: "Muhammad Aayan", role: "Product + Frontend", description: "Architects the product experience, component boundaries, visual telemetry, and reactive UI states.", gradient: "from-cyan-500 to-blue-600", initials: "MA", specialty: "Next.js, UX Architecture, Telemetry Systems" },
  { name: "Dang Quang Tung", role: "Environmental Modeling", description: "Develops thermodynamic transfer functions, UHI simulation logic, and multi-criteria environmental scoring.", gradient: "from-emerald-500 to-cyan-600", initials: "DT", specialty: "Microclimate Modeling, Physics Engines, Thermal Dynamics" },
  { name: "Benjamin You", role: "GIS + Visualization", description: "Engineers spatial data rasterization, WebGL shader layers, GeoJSON rendering, and interactive cartography.", gradient: "from-purple-500 to-indigo-600", initials: "BY", specialty: "GIS Pipelines, Mapbox/MapLibre, Vector Shaders" },
  { name: "Muhammad Abdullah", role: "Backend + Infrastructure", description: "Constructs scalable high-throughput REST/gRPC endpoints, database caching, and cloud data distribution.", gradient: "from-blue-600 to-sky-400", initials: "MA", specialty: "High-Throughput APIs, Geospatial DBs, Cloud Architecture" },
  { name: "Henri", role: "Data + AI", description: "Orchestrates multi-satellite ingestion pipelines, spatial feature embeddings, and LLM diagnostic synthesis.", gradient: "from-amber-500 to-orange-600", initials: "HN", specialty: "Satellite Pipelines, Spatial AI, ML Inference" },
  { name: "Ayesha", role: "Research + Validation", description: "Validates scientific methodology against peer-reviewed urban heat literature and ground sensor networks.", gradient: "from-rose-500 to-pink-600", initials: "AY", specialty: "Urban Climatology, Statistical Validation, Ground Truth" },
];
