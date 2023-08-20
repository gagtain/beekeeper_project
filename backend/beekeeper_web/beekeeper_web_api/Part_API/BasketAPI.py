from django.conf import settings
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from delivery.services.additional import field_in_dict
from global_modules.exception.base import BaseDataException, CodeDataException
from user.models import MainUser
from ..serializers import BasketInfoSerializer, BasketSerializer
from ..services.User import ServicesUser


class AddBasketProduct:

    def add_basket_product(self, request, pk):
        try:
            user = MainUser.objects.only('id').get(id=request.user.id)
            basket_item = ServicesUser.addBasketProduct(user=user, product_item_id=pk)
            return Response({'data': 'success', 'basketItem': BasketSerializer(basket_item).data})
        except CodeDataException as e:
            return Response(data=e.error_data, status=e.status)


class RemoveBasketProduct:
    def remove_basket_product(self, request, pk):
        try:
            data = ServicesUser.removeBasketProduct(request.user.id, pk=pk)
            return Response(data=data, status=status.HTTP_200_OK)
        except CodeDataException as e:
            return Response(data=e.error_data, status=e.status)


class GetBasketInfo:
    def get_basket_info(self, request):
        basket_info = ServicesUser.getBasketInfo(request.user)
        return Response(BasketInfoSerializer(basket_info).data)


class UpdateBasketItemCount:
    """Класс реализующий метод изменения кол-ва товара в корзине"""

    def update_basket_item_count(self, request, basket_pk):
        if not ServicesUser.user_in_basket(basket_id=basket_pk, user_id=request.user.id):
            return Response(data={
                settings.default_error_key: 'данный элемент не находится в корзине пользователя'
            })

        try:
            count = field_in_dict(dict_req=request.data, field='count')
            basket_item = ServicesUser.updateBasketItemCount(basket_pk, count)
            return Response(BasketSerializer(basket_item).data)
        except CodeDataException as e:
            return Response(data=e.error_data, status=e.status)
        except BaseDataException as e:
            return Response(data=e.error_data, status=status.HTTP_400_BAD_REQUEST)


class GetBasket:
    def GetBasket(self, request):
        basket = ServicesUser.getBasket(MainUser.objects.only('id').get(id=request.user.id))
        serializer = BasketSerializer(basket, many=True)
        return Response(serializer.data)