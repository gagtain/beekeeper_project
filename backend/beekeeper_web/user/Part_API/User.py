import datetime
import random

from asgiref.sync import async_to_sync, sync_to_async
from django.core.cache import cache
from rest_framework import status
from rest_framework.response import Response

from beekeeper_web_api.services.cache_keys import user_authorization_token
from global_modules.exception.base import CodeDataException
from user.models import MainUser
from user.serializers import UserLoginSerializer
from user.services.User import UserService


class UserRegisterAuthToken:
    def user_register_auth_token(self, request):
        type_auth = request.data.get('type')
        if type_auth == 'email':
            request.user.email = True
            request.user.save()
        return Response(status=status.HTTP_200_OK)

    def user_unregister_auth_token(self, request):
        type_auth = request.data.get('type')
        if type_auth == 'email':
            request.user.email = False
            request.user.save()
        return Response(status=status.HTTP_200_OK)



class UserSetAuthToken:

    def user_set_auth_token(self, request):
        serializer = UserLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            user = self.get_user(username=serializer.validated_data.get('username'),
                                 password=serializer.validated_data.get('password'))
        except Exception as e:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        if UserService.get_is_sending_code(user=user):
            key = user_authorization_token(user.id)
            value = self.generate_code()
            try:
                func = UserService.sending_user_auth_code(user=user, type_=request.data.get("type_sending"))
                func(user, value, False)
                cache.set(key, value, 60 * 5)
                return Response(data={
                    "time": 60 * 5
                },
                    status=status.HTTP_200_OK)
            except CodeDataException as e:
                return Response(status=e.status, data=e.error_data)
        else:
            return Response(data={
                "error": "У пользователя отключена двухфакторная аутентификация"
            }, status=status.HTTP_400_BAD_REQUEST)

    def generate_code(self):
        letters = "1234567890"
        return ''.join(random.choice(letters) for i in range(5))

    def get_user(self, username, password):
        user = MainUser.objects.get(username=username)
        if user.check_password(password):
            return user
        else:
            raise Exception
