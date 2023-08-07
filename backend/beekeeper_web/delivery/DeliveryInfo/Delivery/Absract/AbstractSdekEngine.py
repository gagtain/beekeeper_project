from django.http import HttpRequest
from requests import Request

from delivery.DeliveryInfo.Delivery.Absract.AbstactDeliveryEngine import AbstractDeliveryEngine
from delivery.DeliveryInfo.Order.Abstract.AbstractOrderSdekEngine import AbstractOrderSdekEngine


class AbstractSdekEngine(AbstractDeliveryEngine):
    """ Типовой абстрактный класс для доставок СДЭК  """
    _order_engine: AbstractOrderSdekEngine
    request: Request

    def __init__(self, data, delivery_pk, request, *args, **kwargs):
        self._order_engine = self._get_order_engine(
            data['order_engine']
        )(order_id=data['order_id'], pred_payment=data['pred_payment'])
        self._set_delivery(delivery_pk)
        self.request = request
        super().__init__(data)

    def get_additional_delivery_info(self, request) -> dict:
        pass
