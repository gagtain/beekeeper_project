from abc import ABC

from django.db.models import QuerySet


class AbstractOrderEngine(ABC):
    _order: QuerySet

    def __init__(self, order: int):

        self._order = order

