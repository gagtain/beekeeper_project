from rest_framework.response import Response

from orders.models import Order
from beekeeper_web_api.serializers import OrderSerializers
from delivery.models import DeliveryTransaction
from payments.models import PaymentTransaction


class OrderClosed:
    def closed(self, request, pk):
        order = Order.objects.get(pk=pk)
        if order.status == Order.StatusChoice.closed:
            return Response(data={'error': 'заказ уже отменен'})
        elif order.delivery.status == DeliveryTransaction.DeliveryStatus.Sent:
            return Response(data={'error': 'заказ уже отправлен'})
        elif order.delivery.status == DeliveryTransaction.DeliveryStatus.Accepted:
            return Response(data={'error': 'доставка заказа уже подтверждена'})
        elif order.payment.status == PaymentTransaction.StatusTransaction.succeeded:
            return Response(data={'error': 'заказ уже оплачен'})
        order.status = Order.StatusChoice.closed
        order.description = request.data['description']
        order.delivery.status = DeliveryTransaction.DeliveryStatus.closed
        order.save()
        order.delivery.save()
        serializer = OrderSerializers(order)

        return Response(serializer.data, status=200)