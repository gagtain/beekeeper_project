class DeliveryService:

    @classmethod
    def add_delivery_in_order(cls, delivery, order):
        order.delivery = delivery
        order.save()
