import enum

from delivery.DeliveryInfo.Delivery.SdekEngine import SdekEngine


class DeliveryEngine(enum.Enum):
    """Класс с движками доставок"""

    sdek = SdekEngine
