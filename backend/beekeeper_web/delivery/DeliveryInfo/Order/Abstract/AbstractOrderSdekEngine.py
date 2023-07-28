from delivery.DeliveryInfo.Order.Abstract.AbstractOrderEngine import AbstractOrderEngine
from delivery.DeliveryInfo.Order.enum.Pred_Payment import PrePayment
from delivery.dilivery_core.shemas.Delivery import Packages
from abc import abstractmethod


class AbstractOrderSdekEngine(AbstractOrderEngine):
    pred_payment: PrePayment

    def __init__(self, pred_payment, *args, **kwargs):
        self.pred_payment = pred_payment
        super().__init__(*args, **kwargs)

    @abstractmethod
    def get_packages(self) -> list[Packages]:
        pass
