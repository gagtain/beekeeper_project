from delivery.models import DeliveryTransaction


class DeliveryInfoService:
    """
    Класс необходимый для получения информации
    необходимой для оформления доставки на основе заказа и системы доставок
    """
    __order: DeliveryTransaction
    __order_engine = None
    __delivery_engine = None

    def __init__(self, delivery: DeliveryTransaction):
        self.__delivery = delivery

    def add_order_engine(self, order_engine):
        self.__order_engine = order_engine

    def add_delivery_engine(self, delivery_engine):
        self.__delivery_engine = delivery_engine

    def get_info_order(self):
        ...

    def get_info(self):
        return self.__delivery_engine(self.get_info_order())
