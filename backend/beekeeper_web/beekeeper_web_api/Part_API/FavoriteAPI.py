from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.response import Response

from beekeeper_web_api.serializers import FavoriteSerializer
from beekeeper_web_api.services.User import ServicesUser
from global_modules.exception.base import CodeDataException
from user.models import MainUser


class GetFavoriteProduct:
    """Класс реализующий получение избранных товаров пользователя"""

    @swagger_auto_schema(tags=['online_store'])
    def GetFavoriteProduct(self, request):
        user = MainUser.objects.only('id').get(id=request.user.id)
        favorite = ServicesUser.getFavoriteProduct(user)
        serializer = FavoriteSerializer(favorite, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AddFavoriteProduct:
    """Класс реализующий добавление товара в избранное пользователя"""

    @swagger_auto_schema(tags=['online_store'])
    def AddFavoriteProduct(self, request, pk):
        user = MainUser.objects.only('id', 'favorite_product').get(id=request.user.id)
        try:
            favorite_item = ServicesUser.addFavoriteProduct(user, pk)
        except CodeDataException as e:
            return Response(data=e.error_data, status=e.status)
        return Response({'data': 'success', 'favoriteItem': FavoriteSerializer(favorite_item).data})


class RemoveFavoriteProduct:
    """Класс реализующий удаление товара из избранного пользователя"""

    @swagger_auto_schema(tags=['online_store'])
    def RemoveFavoriteProduct(self, request, pk):
        user = MainUser.objects.only('favorite_product').get(id=request.user.id)
        try:
            data = ServicesUser.removeFavoriteProduct(user, id=pk)
        except CodeDataException as e:
            return Response(data=e.error_data, status=e.status)
        return Response(data=data, status=status.HTTP_200_OK)
