from typing import Dict, Any
import time
from datetime import datetime, timedelta

class AICache:
    def __init__(self, ttl_minutes: int = 30):
        self.cache: Dict[str, Any] = {}
        self.ttl = timedelta(minutes=ttl_minutes)

    def get(self, key: str) -> Any:
        if key in self.cache:
            item = self.cache[key]
            if datetime.now() - item["timestamp"] < self.ttl:
                return item["value"]
            del self.cache[key]
        return None

    def set(self, key: str, value: Any) -> None:
        self.cache[key] = {
            "value": value,
            "timestamp": datetime.now()
        }

    def cleanup(self) -> None:
        now = datetime.now()
        expired_keys = [
            key for key, item in self.cache.items()
            if now - item["timestamp"] > self.ttl
        ]
        for key in expired_keys:
            del self.cache[key]

ai_cache = AICache()