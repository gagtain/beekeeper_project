from http_api.user.schemas.auth import UserAuthResponseUnauthorized

class CodeDataException(Exception):
    code: int = 400
    data = None

    def __init__(self, code, data, *args):
        self.code = code
        self.data = data
        super().__init__(*args)


class UserUnauthorized(CodeDataException):


    def __init__(self, *args, **kwargs):
        super().__init__(data="Неверно указаны данные", *args, **kwargs)