from delivery.DeliveryInfo.Delivery.Absract.AbstactDeliveryEngine import AbstractDeliveryEngine
from delivery.DeliveryInfo.Order.Abstract.AbstractOrderSdekEngine import AbstractOrderSdekEngine


class AbstractStekEngine(AbstractDeliveryEngine):
    _order_engine: AbstractOrderSdekEngine

    def __init__(self, data, delivery_pk, *args, **kwargs):

        self._order_engine = self._get_order_engine(
            data['order_engine']
        )(order_id=data['order_id'], pred_payment=data['pred_payment'])
        self._set_delivery(delivery_pk)
        super().__init__(data)
