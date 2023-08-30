import datetime
import random

from asgiref.sync import async_to_sync, sync_to_async
from django.core.cache import cache
from rest_framework import status
from rest_framework.response import Response

from beekeeper_web_api.services.cache_keys import user_authorization_token
from user.models import MainUser
from user.serializers import UserLoginSerializer
from user.services.User import UserService


class UserSetAuthToken:

    def user_set_auth_token(self, request):
        serializer = UserLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            user = self.get_user(username=serializer.validated_data.get('username'),
                                 password=serializer.validated_data.get('password'))
        except Exception as e:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        if user.is_email_authorization:
            key = user_authorization_token(user.id)
            value = self.generate_code()
            UserService.sending_user_code_auth("gagtain@gmail.com", value)
            cache.set(key, value, 60 * 5)
            return Response(data={
                "time": 60 * 5
            },
            status=status.HTTP_200_OK)
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
