from drf_yasg.utils import swagger_auto_schema
from rest_framework.response import Response

from orders.models import Order
from beekeeper_web_api.serializers import OrderSerializers
from delivery.models import DeliveryTransaction
from payments.models import PaymentTransaction

class OrderApproved:

    @swagger_auto_schema(tags=['order'])
    def approved(self, request, pk):

        order = Order.objects.get(pk=pk)
        if order.payment.status != PaymentTransaction.StatusTransaction.succeeded:
            return Response({'errors': 'У заказа не оплаченный платеж'}, status=400)
        else:
            order.status = Order.StatusChoice.approved
            order.delivery.status = DeliveryTransaction.DeliveryStatus.Waiting_for_dispatch
            order.save(update_fields=['status'])
            order.delivery.save(update_fields=['status'])
            serializer = OrderSerializers(order)

            return Response(serializer.data, status=200)