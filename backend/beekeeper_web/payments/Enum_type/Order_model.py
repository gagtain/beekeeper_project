import enum

from orders.models import Order


class OrderModel(enum.Enum):
    """Данный класс необходим для получения необходимой модели заказа"""
    online_shop = Order
