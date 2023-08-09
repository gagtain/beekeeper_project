import re

from django.core.exceptions import ValidationError


def number_validator(number: str):
    result = re.match(r'79[0-9]{9}', number)
    if not result:
        raise ValidationError("Неверно указан номер, пример: 79111111111")
