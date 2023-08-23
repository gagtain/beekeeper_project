from drf_yasg.utils import swagger_auto_schema
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from user.jwt_token.auth import CustomAuthentication
from .Part_API.BasketAPI import GetBasket, AddBasketProduct, UpdateBasketItemCount, RemoveBasketProduct, GetBasketInfo
from .Part_API.FavoriteAPI import GetFavoriteProduct, AddFavoriteProduct, RemoveFavoriteProduct
from .Part_API.OrderAPI import OrderCreateAPI, OrderGetLastAPI, OrderGetListAPI, OrderCheckout
from .Part_API.RatingProductAPI import RatingProductCreate, RatingProductList, RatingProductAVG
from .Part_API.ProductAPI import ProductFilterName, ProductFilter, GetProduct, GetProductList
from .serializers import CategoryRetriveSerializers
from .services.User import CategoryServises


class BasketAPI(viewsets.ViewSet, GetBasketInfo,
                UpdateBasketItemCount, RemoveBasketProduct,
                AddBasketProduct, GetBasket):
    authentication_classes = [CustomAuthentication]
    permission_classes = [IsAuthenticated]


class FavoriteProductAPI(viewsets.ViewSet, GetFavoriteProduct, AddFavoriteProduct, RemoveFavoriteProduct):
    authentication_classes = [CustomAuthentication]
    permission_classes = [IsAuthenticated]


class ProductFilterNameAPI(viewsets.ViewSet, ProductFilterName):
    pass


class ProductAPI(viewsets.ViewSet, GetProduct, GetProductList):
    pass


class ProductFilterAPI(viewsets.ViewSet, ProductFilter):
    pass


class CategoryAPI(viewsets.ViewSet):
    authentication_classes = [CustomAuthentication]

    @swagger_auto_schema(tags=['online_store'])
    def get_category_list(self, request):
        category_list = CategoryServises.getCategoryList().only('name')
        return Response(CategoryRetriveSerializers(category_list, many=True).data)


class OrderAPI(viewsets.ViewSet, OrderCreateAPI, OrderGetLastAPI, OrderGetListAPI, OrderCheckout):
    authentication_classes = [CustomAuthentication]
    permission_classes = [IsAuthenticated]


class RatingAPI(viewsets.ViewSet, RatingProductCreate, RatingProductList, RatingProductAVG):
    pass
