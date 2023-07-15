from rest_framework.response import Response
from rest_framework.views import APIView

from ..serializers import RetrieveProduct, BasketInfoSerializer
from ..services.User import ServicesUser


class UserBasketRetrieveAPI(APIView):

    def get_basket(self, request):
        basket = ServicesUser.getBasket(request.user)
        serializer = RetrieveProduct(basket, many=True, context={'user_id': request.user.id})
        return Response(serializer.data)


class UserBasketAddItemAPI(APIView):

    def add_basket_item(self, request, pk):

        return ServicesUser.addBasketProduct(request, pk)


class UserBasketRemoveItemAPI(APIView):

    def remove_basket_item(self, request, pk):
        return ServicesUser.removeBasketProduct(request.user, product=pk, **request.data)


class UserBasketGetInfo(APIView):

    def get_basket_item(self, request):
        return Response(BasketInfoSerializer(ServicesUser.getBasketInfo(request.user)).data)