def select_measurements(records, fields):
    """Keep supplied values and timestamps; never fill gaps with zero."""
    return [
        {name: row.get(name) for name in ("grid_cell_id", "timestamp", *fields)}
        for row in records
    ]
