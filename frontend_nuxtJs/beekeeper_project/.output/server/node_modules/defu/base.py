class BaseDataException(Exception):
    error_data = {
        'error': ''
    }

    def __init__(self, error: str):
        self.error_data['error'] = error
        super().__init__(error)
