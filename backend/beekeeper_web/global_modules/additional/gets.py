from django.core.exceptions import ValidationError
from django.db.models import QuerySet

from global_modules.exception.base import BaseDataException


def get_object_or_404(obj: QuerySet, *args, **kwargs):
    try:
        return obj.get(*args, **kwargs)
    except (TypeError, ValueError, ValidationError):
        raise BaseDataException(f'объект {obj.__name__} с указанными параметрами не существует')
