from delivery.models import DeliveryTransaction


class DeliveryService:

    @classmethod
    def add_delivery_in_order(cls, delivery, order):
        delivery.order_delivery_transaction.add(order)
    @classmethod
    def create_delivery(cls, **kwargs):
        delivery = DeliveryTransaction.objects.create(**kwargs)
        return delivery
