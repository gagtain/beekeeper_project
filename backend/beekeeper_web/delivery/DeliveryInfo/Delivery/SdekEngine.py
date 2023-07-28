from delivery.DeliveryInfo.Delivery.Absract.AbstractSdekEngine import AbstractStekEngine
from delivery.DeliveryInfo.Delivery.enum.SdekOrderEngineEnum import SdekOrderEngineEnum
from delivery.dilivery_core.shemas.Delivery import DeliveryAdd
from delivery.models import DeliveryTransaction


class SdekEngine(AbstractStekEngine):
    _order_engine_enum = SdekOrderEngineEnum
    _delivery_model = DeliveryTransaction
    _delivery: DeliveryTransaction

    def _initial_data(self):
        self._info = DeliveryAdd(
            delivery_point=self._delivery.where,
            packages=self._order_engine.get_packages(),
            tariff_code=self._data['tariff_code']
        )
