from collections import OrderedDict
from copy import deepcopy
from time import monotonic


class ReadCache:
    """Small per-process cache. Empty reads and failed queries are never stored."""

    def __init__(self, ttl_seconds: float, max_entries: int, clock=monotonic):
        self.ttl_seconds = ttl_seconds
        self.max_entries = max_entries
        self.clock = clock
        self.entries = OrderedDict()

    async def read(self, key, load):
        entry = self.entries.get(key)
        if entry is not None:
            expires, value = entry
            if self.clock() < expires:
                self.entries.move_to_end(key)
                return deepcopy(value)
            del self.entries[key]
        value = await load()
        if value and self.ttl_seconds > 0:
            self.entries[key] = (self.clock() + self.ttl_seconds, deepcopy(value))
            self.entries.move_to_end(key)
            while len(self.entries) > self.max_entries:
                self.entries.popitem(last=False)
        return value

    def clear(self):
        self.entries.clear()
