from django.shortcuts import render
from rest_framework import status
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ViewSet

from .Part_API.User_Edit import UserImageEdit, GetUserNumber
from .serializers import UserRegisterSerializers, RetrieveUser
from user.jwt_token.auth import CustomAuthentication


# Create your views here.

class UserRegistAPI(CreateAPIView):
    serializer_class = UserRegisterSerializers

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response({'data': 'Пользователь создан'}, status=status.HTTP_201_CREATED, headers=headers)


class tokenVerif(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [CustomAuthentication]

    def post(self, request):
        return Response(RetrieveUser(request.user, context={'user_id': request.user.id}).data)


class UserAPI(ViewSet, UserImageEdit, GetUserNumber):
    authentication_classes = [CustomAuthentication]
