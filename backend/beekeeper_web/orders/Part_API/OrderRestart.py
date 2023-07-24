from rest_framework.response import Response

from beekeeper_web_api.models import Order, OrderItem, ProductItem


class OrderRestart:
    def restart(self, request, pk):
        product_items_in_order = ProductItem.objects.filter(orderitem__order__id=pk).only('id')
        request.user.basket.add(*product_items_in_order)
        return Response(status=200)