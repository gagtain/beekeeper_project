import sys

from django.db.models import Sum, Count
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect
from rest_framework import viewsets
from rest_framework.mixins import CreateModelMixin
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from user.jwt_token.auth import CustomAuthentication
from .Part_API.OrderAPI import OrderCreateAPI, OrderGetLastAPI, OrderGetListAPI
from .Part_API.RatingProductAPI import RatingProductCreate, RatingProductList, RatingProductAVG
from .Part_API.ProductAPI import ProductFilterName, ProductFilter
from .serializers import RetrieveProduct, RetrieveProductRemoveToProdachen,\
    CategoryRetriveSerializers, BasketInfoSerializer
from .services.User import ServicesUser, ProductServises, CategoryServises
sys.path.append('.')
class UserAPI(viewsets.ViewSet):
    authentication_classes = [CustomAuthentication]


    def GetBasket(self, request):
        basket = ServicesUser.getBasket(request.user)
        # basket = ServicesUser.getBasket(1)
        serializer = RetrieveProduct(basket, many=True, context={'user_id': request.user.id})
        return Response(serializer.data)

    def GetFavoriteProduct(self, request):

        basket = ServicesUser.getFavoriteProduct(request.user)
        # basket = ServicesUser.getBasket(1)
        serializer = RetrieveProduct(basket, many=True)
        return Response(serializer.data)

    def AddFavoriteProduct(self, request, pk):
        return ServicesUser.addFavoriteProduct(request, pk)

    def RemoveFavoriteProduct(self, request, pk):
        return ServicesUser.removeFavoriteProduct(request=request, id=pk)

    def AddBasketProduct(self, request, pk):

        return ServicesUser.addBasketProduct(request, pk)

    def RemoveBasketProduct(self, request, pk):
        return ServicesUser.removeBasketProduct(request.user, pk=pk)

    def GetBasketInfo(self, request):
        return Response(BasketInfoSerializer(ServicesUser.getBasketInfo(request.user)).data)



    def UpdateBasketItemCount(self, request, basket_pk):
        return ServicesUser.updateBasketItemCount(basket_pk, request.user, request.data['count'])


ensure_csrf = method_decorator(ensure_csrf_cookie)


class setCSRFCookie(APIView):
    permission_classes = []
    authentication_classes = []
    @ensure_csrf
    def get(self, request):
        return Response("CSRF Cookie set.")


    

class ProductAPI(viewsets.ViewSet, ProductFilterName):

    def get_popular(self, request):
        print(213)
        size = int(request.GET['size'])
        return Response(RetrieveProductRemoveToProdachen(ProductServises.getPopular(size), many=True).data)
    
    def get_product_list(self, request):
        size = int(request.GET['size'])
        return Response(RetrieveProductRemoveToProdachen(ProductServises.getProductList(size), many=True).data)
    
    def get_product(self, request, id):

        return Response(RetrieveProductRemoveToProdachen(ProductServises.getProduct(id)[0]).data)


class ProductFilterAPI(viewsets.ViewSet, ProductFilter):
    pass



class CategoryAPI(viewsets.ViewSet):
    authentication_classes = [CustomAuthentication]

    def get_category_list(self, request):
        return Response(CategoryRetriveSerializers(CategoryServises.getCategoryList(), many=True).data)



class OrderAPI(viewsets.ViewSet, OrderCreateAPI, OrderGetLastAPI, OrderGetListAPI):
    authentication_classes = [CustomAuthentication]


class RatingAPI(viewsets.ViewSet, RatingProductCreate, RatingProductList, RatingProductAVG):

    pass

