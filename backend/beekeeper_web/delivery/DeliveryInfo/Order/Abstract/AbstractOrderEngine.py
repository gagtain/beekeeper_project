from abc import ABC

from django.db.models import QuerySet


class AbstractOrderEngine(ABC):
    """ Абстрактный класс для заказов """

    _order: QuerySet

    def __init__(self, order: QuerySet):

        self._order = order

