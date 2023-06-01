from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .jwt_token.auth import CustomAuthentication
from .serializers import RetrieveUserBalanceChange, RetrieveProduct, RetrieveUser, RetrieveProductRemoveToProdachen
from .services.User import ServicesUser, ProductServises

csrf_protect_method = method_decorator(csrf_protect)

# Create your views here.

class UserAPI(viewsets.ViewSet):
    authentication_classes = [CustomAuthentication]

    def GetLastOrder(self, request):
        last_order = ServicesUser.getLastOrder(request.user.id)
        # last_order = ServicesUser.getLastOrder(1)
        serializer = RetrieveUserBalanceChange(last_order)
        return Response(serializer.data)

    def GetBasket(self, request):
        print(request.user)
        print(123)
        basket = ServicesUser.getBasket(request.user)
        # basket = ServicesUser.getBasket(1)
        serializer = RetrieveProduct(basket, many=True, context={'user_id': request.user.id})
        return Response(serializer.data)

    def GetFavoriteProduct(self, request):

        basket = ServicesUser.getFavoriteProduct(request.user)
        # basket = ServicesUser.getBasket(1)
        serializer = RetrieveProduct(basket, many=True)
        return Response(serializer.data)

    @csrf_protect_method
    def AddFavoriteProduct(self, request, pk):
        return ServicesUser.addFavoriteProduct(request.user, pk)

    @csrf_protect_method
    def RemoveFavoriteProduct(self, request, pk):
        return ServicesUser.removeFavoriteProduct(request.user, pk)
    @csrf_protect_method
    def AddBasketProduct(self, request, pk):
        return ServicesUser.addBasketProduct(request.user, pk)

    @csrf_protect_method
    def RemoveBasketProduct(self, request, pk):
        return ServicesUser.removeBasketProduct(request.user, pk)


ensure_csrf = method_decorator(ensure_csrf_cookie)


class setCSRFCookie(APIView):
    permission_classes = []
    authentication_classes = []
    @ensure_csrf
    def get(self, request):
        return Response("CSRF Cookie set.")



class tokenVerif(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [CustomAuthentication]
    def post(self, request):
        
        return Response(RetrieveUser(request.user).data)
    

class ProductAPI(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    authentication_classes = [CustomAuthentication]

    def get_popular(self, request):
        size = int(request.GET['size'])
        return Response(RetrieveProductRemoveToProdachen(ProductServises.getPopular(size), many=True).data)







