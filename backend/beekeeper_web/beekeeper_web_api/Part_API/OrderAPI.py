import sys

from django.db.models import Q
from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from rest_framework.views import APIView

from orders.tasks import check_order_payment
from user.models import MainUser
from ..models import BasketItem
from ..services.Order import OrderServices

sys.path.append('.')

from ..serializers import OrderSerializers
from orders.serializers import OrderSerializers as order_ser


class OrderCreateAPI(APIView):

    def createOrder(self, request):
        if request.data.get('basket'):
            data = request.data.get('basket')
            order = OrderServices.createOrderInList(request=request,
                                                    data=data)
        else:
            BasketItemList = BasketItem.objects.filter(user=request.user)
            order = OrderServices.createOrderInBasket(request=request, basket_item_list=BasketItemList,
                                                      )
        check_order_payment.apply_async(kwargs={"order_id": order.id}, countdown=30 * 60)
        return Response(OrderSerializers(order).data)


class OrderGetLastAPI(APIView):

    def getLastOrder(self, request):
        order = OrderServices.getLastOrder(user_id=request.user.id)
        return Response(order_ser(order).data)


class OrderGetListAPI(APIView):

    def getOrderList(self, request):
        order_list = OrderServices.getOrderList(user=MainUser.objects.get(id=1))
        if order_list.count():
            return Response(order_ser(order_list, many=True).data)
        else:
            raise NotFound("У пользователя нет заказов")
