
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ViewSet

from .Part_API.User import UserSetAuthToken, UserRegisterAuthToken
from .Part_API.User_Edit import UserImageEdit, GetUserNumber
from .models import MainUser
from .serializers import UserRegisterSerializers, RetrieveUser
from user.jwt_token.auth import CustomAuthentication
from .services.optimize_orm import optimize_basket, optimize_favorite, default_user_only


# Create your views here.

class UserRegistAPI(CreateAPIView):
    serializer_class = UserRegisterSerializers

    @swagger_auto_schema(tags=['user'])
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response({'data': 'Пользователь создан'}, status=status.HTTP_201_CREATED, headers=headers)


class tokenVerif(APIView):
    authentication_classes = [CustomAuthentication]
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(tags=['user'])
    def post(self, request: Request):
        user = MainUser.objects.only(*default_user_only(), 'basket', 'favorite_product')\
            .prefetch_related(optimize_basket, optimize_favorite).get(id=request.user.id)
        return Response(RetrieveUser(user).data)


class UserAPI(ViewSet, UserImageEdit, GetUserNumber, UserSetAuthToken, UserRegisterAuthToken):
    authentication_classes = [CustomAuthentication]
