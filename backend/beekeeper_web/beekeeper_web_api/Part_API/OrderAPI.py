import sys

from django.db.models import Q
from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from rest_framework.views import APIView

from orders.tasks import check_order_payment
from ..models import BasketItem
from ..services.Order import OrderServices
sys.path.append('.')

from ..serializers import OrderSerializers


class OrderCreateAPI(APIView):

    def createOrder(self, request):
        if request.data.get('basket'):
            BasketItemList = request.data.get('basket')
            order = OrderServices.createOrderInBasket(request=request.user, basket_item_list=BasketItemList,
                                                      data=request.data)
        else:
            BasketItemList = BasketItem.objects.filter(user=request.user)
            order = OrderServices.createOrderInBasket(request=request, basket_item_list=BasketItemList,
                                                      data=request.data)
        # check_order_payment.apply_async(kwargs={"order_id": order.id}, countdown=30 * 60)
        return Response(OrderSerializers(order).data)

class OrderGetLastAPI(APIView):

    def getLastOrder(self, request):
        order = OrderServices.getLastOrder(user_id=request.user.id)
        return Response(OrderSerializers(order).data)

class OrderGetListAPI(APIView):

    def getOrderList(self, request):
        order_list = OrderServices.getOrderList(user=request.user)
        if order_list.count():
            return Response(OrderSerializers(order_list, many=True).data)
        else:
            raise NotFound("У пользователя нет заказов")