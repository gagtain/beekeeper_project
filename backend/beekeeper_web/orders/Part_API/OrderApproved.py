from rest_framework.response import Response

from beekeeper_web_api.models import Order
from beekeeper_web_api.serializers import OrderSerializers
from delivery.models import DeliveryTransaction
from payments.models import PaymentTransaction

class OrderApproved:

    def approved(self, request, pk):

        order = Order.objects.get(pk=pk)
        if order.payment.status !=  PaymentTransaction.StatusTransaction.succeeded:
            return Response({'errors': 'У заказа не оплаченный платеж'}, status=400)
        else:
            order.status = Order.StatusChoice.approved
            order.delivery.status = DeliveryTransaction.DeliveryStatus.Waiting_for_dispatch
            order.save()
            order.delivery.save()
            serializer = OrderSerializers(order)

            return Response(serializer.data, status=200)