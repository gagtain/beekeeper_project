import enum

from delivery.DeliveryInfo.Delivery.SdekEngine import SdekEngine


class DeliveryEngine(enum.Enum):
    """Класс с движками доставок"""

    sdek = SdekEngine

    @classmethod
    def choices(cls):
        return tuple((i.name, i.name) for i in cls)
