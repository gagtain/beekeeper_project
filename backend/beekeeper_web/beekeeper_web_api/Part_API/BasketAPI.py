from rest_framework.response import Response
from rest_framework.views import APIView

from ..serializers import RetrieveProduct, BasketInfoSerializer
from ..services.User import ServicesUser


class AddBasketProduct:

    def add_basket_product(self, request, pk):
        return ServicesUser.addBasketProduct(request, pk)


class RemoveBasketProduct:
    def remove_basket_product(self, request, pk):
        return ServicesUser.removeBasketProduct(request.user, pk=pk)


class GetBasketInfo:
    def get_basket_info(self, request):
        return Response(BasketInfoSerializer(ServicesUser.getBasketInfo(request.user)).data)


class UpdateBasketItemCount:
    def update_basket_item_count(self, request, basket_pk):
        return ServicesUser.updateBasketItemCount(basket_pk, request.user, request.data['count'])
