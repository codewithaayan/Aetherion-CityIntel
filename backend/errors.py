class APIError(Exception):
    def __init__(self, status: int, code: str, message: str):
        self.status = status
        self.code = code
        self.message = message


def unavailable(code: str, message: str) -> APIError:
    return APIError(503, code, message)
