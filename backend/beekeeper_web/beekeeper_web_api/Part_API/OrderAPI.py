import sys

from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from rest_framework.views import APIView

from ..services.Order import OrderServices
sys.path.append('.')
from ..models import MainUser, BasketItem

from ..serializers import OrderSerializers


class OrderCreateAPI(APIView):

    def createOrder(self, request):
        if request.data.get('basket'):
            BasketItemList = request.data.get('basket')
            order = OrderServices.createOrderInBasket(request=request.user, BasketItemList=BasketItemList,
                                                      data=request.data)
        else:
            BasketItemList = BasketItem.objects.filter(user=request.user)
            order = OrderServices.createOrderInBasket(request=request, BasketItemList=BasketItemList,
                                                      data=request.data)
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