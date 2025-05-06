from typing import Dict, List
import time
from fastapi import HTTPException

class RateLimiter:
    def __init__(self, requests_per_minute: int = 60):
        self.requests_per_minute = requests_per_minute
        self.requests: Dict[str, List[float]] = {}

    def check_rate_limit(self, client_id: str) -> None:
        current_time = time.time()
        if client_id not in self.requests:
            self.requests[client_id] = []

        # Remove requests older than 1 minute
        self.requests[client_id] = [
            req_time for req_time in self.requests[client_id]
            if current_time - req_time < 60
        ]

        if len(self.requests[client_id]) >= self.requests_per_minute:
            raise HTTPException(
                status_code=429,
                detail="Rate limit exceeded. Please try again later."
            )

        self.requests[client_id].append(current_time)

rate_limiter = RateLimiter()