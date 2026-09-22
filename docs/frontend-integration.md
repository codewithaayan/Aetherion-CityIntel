# Frontend integration

The frontend now uses `lib/api.ts` as the single browser-facing API boundary. It reads `NEXT_PUBLIC_API_BASE_URL`, sends non-cached JSON GET requests, converts backend snake_case fields to frontend camelCase, and preserves null as missing data.

| Screen or component | Backend route |
| --- | --- |
| Landing city panel | `GET /api/cities`, then the selected city's areas and first available area's risk |
| Explore city selector | `GET /api/cities` |
| Explore area selector | `GET /api/cities/{city_id}/areas` |
| Explore selected-area card | `GET /api/areas/{area_id}/risk` plus population on the area record |
| Explore layer selector | `GET /api/areas/{area_id}/layers/heat`, `/green`, or `/flood` |
| Area dashboard | `GET /api/areas/{area_id}`, `/risk`, `/population`, and `/layers/heat` |
| Simulation page | Area GET only; the POST is not sent until Arjun and Chip supply their request and response models |
| AI analysis page | Area GET only; the POST is not sent until Arjun supplies the request and response models |

Important mappings are `city_id -> cityId`, `population_exposure -> populationExposure`, `high_risk_population -> highRiskPopulation`, `grid_population -> gridPopulation`, `grid_cell_id -> gridCellId`, `data_sources -> dataSources`, and `incomplete_grid_cell_ids -> incompleteGridCellIds`.

The old combined mock area object, fixed AI answers, random landing metrics, fake simulator coefficients, historical charts, exposure chart, risk bands, confidence values, and fixed demonstration area links were removed. Missing scores render as an em dash. API failures and empty city/area lists render an explicit notice.

The map receives the real area geometry and selected raw FeatureCollection, but Infinity still owns visual rendering. Historical trends have no backend route. Simulation and AI POST payloads remain unimplemented because the owners have not defined their schemas. The UI includes the required notice that future AI output may contain errors and requires human review.

Local setup and checks are in the repository README.
