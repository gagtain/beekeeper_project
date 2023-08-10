from delivery.models import DeliveryTransaction

Sent_Status = [DeliveryTransaction.DeliveryStatus.Sent,
               DeliveryTransaction.DeliveryStatus.Waiting_at_the_pickup_point,
               DeliveryTransaction.DeliveryStatus.Accepted]

class DeliveryService:

    @classmethod
    def add_delivery_in_order(cls, delivery, order):
        delivery.order_delivery_transaction.add(order)
    @classmethod
    def create_delivery(cls, **kwargs):
        delivery = DeliveryTransaction.objects.create(**kwargs)
        return delivery
