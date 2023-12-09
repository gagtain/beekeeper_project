import datetime

from django.conf import settings
from django.contrib.auth.hashers import make_password
from django.core.cache import cache
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from beekeeper_web_api.services.User import ServicesUser
from beekeeper_web_api.services.cache_keys import user_authorization_token
from delivery.services.additional import field_in_dict
from global_modules.exception.base import CodeDataException, BaseDataException
from .serializers import MyTokenObtainPairSerializer, CookieTokenRefreshSerializer
from ..models import MainUser
from ..services.User import UserService


class MyObtainTokenPairView(TokenObtainPairView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = MyTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        user: MainUser = serializer.user
        if request.data.get('is_admin') and not user.is_superuser:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={
                'error': "Статус пользователя не соответствует запрашиваемому"
            })

        if UserService.get_is_sending_code(user=user):
            """Проверка на наличие токена в кэше и его сравнение"""
            try:
                select_token = field_in_dict(request.data, "token")
                token = ServicesUser.user_code_token_get(user_id=user.id)
                print(token)
                ServicesUser.user_code_toke_validate(token, select_token)
                ServicesUser.user_code_token_delete(user_id=user.id)
                return self.set_response(serializer=serializer)
            except CodeDataException as e:
                return Response(data=e.error_data, status=e.status)
            except BaseDataException as e:
                return Response(data=e.error_data, status=status.HTTP_400_BAD_REQUEST)
        else:
            return self.set_response(serializer=serializer)


    def set_response(self, serializer):
        access = serializer.validated_data.get("access", None)
        refresh = serializer.validated_data.get("refresh", None)
        # build your response and set cookie
        if access is not None:
            response = Response({"access": access, "refresh": refresh}, status=200)
            response.set_cookie('assess', access, domain=settings.COOKIE_DOMAIN, max_age=36000, httponly=True)
            response.set_cookie('refresh', refresh, domain=settings.COOKIE_DOMAIN, max_age=36000, httponly=True)
            return response
        else:

            return Response({"Error": "Something went wrong"}, status=status.HTTP_400_BAD_REQUEST)

class CookieTokenRefreshView(TokenRefreshView):
    serializer_class = CookieTokenRefreshSerializer

    def finalize_response(self, request, response, *args, **kwargs):
        if response.data.get('access'):
            response.set_cookie('token', response.data['access'])
            response.delete_cookie('refresh')
        return super().finalize_response(request, response, *args, **kwargs)
