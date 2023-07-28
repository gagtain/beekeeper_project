from rest_framework.response import Response

from orders.models import Order
from beekeeper_web_api.serializers import OrderSerializers


class OrderRetrieve:

    def retrieve(self, request, pk):
        order = Order.objects.get(pk=pk)
        serializer = OrderSerializers(order)
        return Response(serializer.data, status=200)