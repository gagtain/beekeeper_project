from drf_yasg.utils import swagger_auto_schema
from rest_framework.response import Response

from beekeeper_web_api.models import ProductItem, BasketItem


class OrderRestart:
    @swagger_auto_schema(tags=['order'])
    def restart(self, request, pk):
        product_items_in_order = ProductItem.objects.filter(orderitem__order__id=pk).only('id')
        BasketItem.objects.create(user_id=request.user.id, productItem_id=product_items_in_order[0].id)
        return Response(status=200)
