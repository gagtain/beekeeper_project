from drf_yasg.utils import swagger_auto_schema
from rest_framework.response import Response

from orders.models import Order
from orders.serializers import OrderSerializers
from orders.services.optimize_orm import default_order_optimize


class OrderRetrieve:

    @swagger_auto_schema(tags=['order'])
    def retrieve(self, request, pk):
        order = default_order_optimize(Order.objects).get(pk=pk)
        serializer = OrderSerializers(order)

        return Response(serializer.data, status=200)