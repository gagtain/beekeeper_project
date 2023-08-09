from delivery.DeliveryInfo.Order.Abstract.AbstractOrderEngine import AbstractOrderEngine
from delivery.DeliveryInfo.Order.enum.Pred_Payment import PrePayment
from delivery.dilivery_core.shemas.Delivery import Packages
from abc import abstractmethod


class AbstractOrderSdekEngine(AbstractOrderEngine):
    """ Типовой абстрактный класс у заказов для доставки СДЭК  """

    pred_payment: PrePayment

    def __init__(self, pred_payment: str, *args, **kwargs):
        self.pred_payment = getattr(PrePayment, pred_payment)
        super().__init__(*args, **kwargs)

    @abstractmethod
    def get_packages(self) -> list[Packages]:
        pass

    @abstractmethod
    def get_recipient(self):
        pass
