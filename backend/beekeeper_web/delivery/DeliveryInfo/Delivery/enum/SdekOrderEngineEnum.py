import enum

from delivery.DeliveryInfo.Order.SdekEngine import SdekOnlineStoreEngine


class SdekOrderEngineEnum(enum.Enum):
    """Класс с движками заказов для системы доставок СДЭК"""

    online_store = SdekOnlineStoreEngine
