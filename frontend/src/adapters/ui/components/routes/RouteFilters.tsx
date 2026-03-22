import { RouteFilters as Filters } from '../../../../core/domain/route';
import { VESSEL_TYPES, FUEL_TYPES, YEARS } from '../../../../shared/constants';

interface RouteFiltersProps {
  filters:    Filters;
  onChange:   (f: Filters) => void;
}

export function RouteFilters({ filters, onChange }: RouteFiltersProps) {
  return (
    <div className="flex flex-wrap gap-3">

      {/* Vessel Type */}
      <select
        value={filters.vesselType ?? ''}
        onChange={(e) =>
          onChange({ ...filters, vesselType: e.target.value || undefined })
        }
        className="input-field"
      >
        <option value="">All Vessel Types</option>
        {VESSEL_TYPES.map((v) => (
          <option key={v} value={v}>{v}</option>
        ))}
      </select>

      {/* Fuel Type */}
      <select
        value={filters.fuelType ?? ''}
        onChange={(e) =>
          onChange({ ...filters, fuelType: e.target.value || undefined })
        }
        className="input-field"
      >
        <option value="">All Fuel Types</option>
        {FUEL_TYPES.map((f) => (
          <option key={f} value={f}>{f}</option>
        ))}
      </select>

      {/* Year */}
      <select
        value={filters.year ?? ''}
        onChange={(e) =>
          onChange({
            ...filters,
            year: e.target.value ? Number(e.target.value) : undefined,
          })
        }
        className="input-field"
      >
        <option value="">All Years</option>
        {YEARS.map((y) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>

      {/* Clear */}
      {(filters.vesselType || filters.fuelType || filters.year) && (
        <button
          onClick={() => onChange({})}
          className="btn-ghost"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}