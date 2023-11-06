import sys

from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView

from delivery.services.additional import field_in_dict
from global_modules.exception.base import CodeDataException, BaseDataException
from orders.tasks import check_order_payment
from user.models import MainUser
from ..models import BasketItem
from ..services.Order import OrderServices
from ..tasks import order_checkout_check

sys.path.append('.')

from ..serializers import OrderSerializers, UserBasketPkList
from orders.serializers import OrderSerializers as order_ser


class OrderCreateAPI(APIView):
    """Класс реализующий создание заказа"""

    @swagger_auto_schema(tags=['online_store'])
    def createOrder(self, request):
        if request.data.get('order_id'):
            try:
                order = OrderServices.create_order_in_checkout(checkout_id=request.data['order_id'],
                                                               delivery_price=request.data['delivery_price'],
                                                               user=request.user)
            except CodeDataException as e:
                return Response(data=e.error_data, status=e.status)
        else:
            BasketItemList = BasketItem.objects.filter(user=request.user)
            order = OrderServices.createOrderInBasket(request=request, basket_item_list=BasketItemList,
                                                      )
        check_order_payment.apply_async(kwargs={"order_id": order.id}, countdown=30 * 60)
        return Response(OrderSerializers(order).data)


class OrderGetLastAPI(APIView):
    """Класс реализующий получение последнего заказа пользователя"""

    @swagger_auto_schema(tags=['online_store'])
    def getLastOrder(self, request):
        try:
            order = OrderServices.getLastOrder(user_id=request.user.id)
        except CodeDataException as e:
            return Response(data=e.error_data, status=e.status)
        return Response(order_ser(order).data)


class OrderGetListAPI(APIView):
    """Класс реализующий получение всех заказов пользователя"""

    @swagger_auto_schema(tags=['online_store'])
    def getOrderList(self, request):
        user = MainUser.objects.only('user_order').get(id=request.user.id)
        order_list = OrderServices.getOrderList(user=user)
        return Response(order_ser(order_list, many=True).data)


class OrderCheckout(APIView):
    """Класс реализующий создание не оформленного заказа"""

    @swagger_auto_schema(tags=['online_store'])
    def checkout_order_in_data(self, request):
        try:
            basket_item_list_id = field_in_dict(dict_req=request.data, field='basket_id_list')
            if basket_item_list_id != '__all__':
                basket_pk_serializer = UserBasketPkList(data={
                    'basket': basket_item_list_id
                })
                basket_pk_serializer.is_valid(raise_exception=True)
                basket_item_list = OrderServices.examination_basket_item_in_user(basket_item_list=basket_item_list_id,
                                                                                user=request.user)
            else:
                basket_item_list = request.user.basket.all()
        except BaseDataException as e:
            return Response(status=status.HTTP_400_BAD_REQUEST, data=e.error_data)
        except ValidationError as e:
            raise e
        order = OrderServices.checkout_order_create(basket_item_list=basket_item_list,
                                                    user_id=request.user.id)
        order_checkout_check.apply_async(kwargs={"order_id": order.id}, countdown=30 * 60)
        return Response(data={'order_id': order.id}, status=status.HTTP_200_OK)
