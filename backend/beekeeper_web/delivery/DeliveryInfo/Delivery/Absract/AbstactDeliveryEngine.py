import enum
from abc import ABC, abstractmethod

from django.core.exceptions import ValidationError
from django.db import models
from django.db.models import QuerySet
from django.http import Http404
from rest_framework.generics import get_object_or_404
from rest_framework.exceptions import NotFound
from delivery.DeliveryInfo.Order.Abstract.AbstractOrderEngine import AbstractOrderEngine


class AbstractDeliveryEngine(ABC):
    """Абстрактный класс для всех движков доставок"""

    _info = {}
    _data = {}
    _order_engine = None
    _delivery: QuerySet
    _delivery_model: models.Model
    _order_engine_enum: enum.Enum.__class__

    def __init__(self, data):
        self._data = data

    def _get_order_engine(self, order_engine):
        return self._order_engine_enum.get(order_engine)

    def _set_delivery(self, pk):
        try:
            self._delivery = self._delivery_model.objects.get(pk=pk)

        except:
            raise NotFound(detail='Выбранной доставки не существует')

    @abstractmethod
    def _initial_data(self):
        """Точка входа для изменения __info"""
        pass

    def get_info(self):
        self._initial_data()
        return self._info

    @abstractmethod
    def get_additional_delivery_info(self) -> dict:
        ...
