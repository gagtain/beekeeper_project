from rest_framework.response import Response

from delivery.DeliveryInfo.Delivery.Absract.AbstactDeliveryEngine import AbstractDeliveryEngine
from delivery.DeliveryInfo.Delivery.enum.SdekOrderEngineEnum import SdekOrderEngineEnum
from delivery.dilivery_core.shemas.Delivery import DeliveryAdd, Recipient
from delivery.models import DeliveryTransaction


class SdekEngine(AbstractDeliveryEngine):
    """ Класс движка доставки СДЭК """

    _order_engine_enum = SdekOrderEngineEnum
    _delivery_model = DeliveryTransaction
    _delivery: DeliveryTransaction

    def __init__(self, data, delivery_pk, request, *args, **kwargs):
        self._set_delivery(delivery_pk)
        order_engine_class = self._get_order_engine(
            data['order_engine']
        )
        self._order_engine = order_engine_class(order_id=self._delivery.order_delivery_transaction.all()[0].id,
                                                pred_payment=data['pred_payment'])
        self.request = request
        super().__init__(data)

    def _initial_data(self):
        self._info = DeliveryAdd(
            delivery_point=self._delivery.where,
            packages=self._order_engine.get_packages(),
            tariff_code=self._data['tariff_code'],
            **self.get_additional_delivery_info()
        )

    def get_additional_delivery_info(self) -> dict:
        data = {}
        if self.request.data.get('shipment_point'):
            data['shipment_point'] = self.request.data['shipment_point']
        if self.request.data.get('recipient'):
            data['recipient'] = self.request.data.get('recipient')
        else:
            data['recipient'] = self._order_engine.get_recipient()

        return data
