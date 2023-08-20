from beekeeper_web.settings import default_error_key


class BaseDataException(Exception):
    error_data = {
    }

    def __init__(self, error: str):
        self.error_data[default_error_key] = error
        super().__init__(error)


class CodeDataException(BaseDataException):
    status: int = 400

    def __init__(self, status, error):
        self.status = status
        super().__init__(error)