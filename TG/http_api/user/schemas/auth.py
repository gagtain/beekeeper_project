from dataclasses import dataclass

from dataclasses_json import dataclass_json


@dataclass_json
@dataclass
class UserAuthRequest:
    username: str
    password: str
    token: str | None = None


@dataclass_json
@dataclass
class UserAuthResponseUnauthorized:
    detail: str