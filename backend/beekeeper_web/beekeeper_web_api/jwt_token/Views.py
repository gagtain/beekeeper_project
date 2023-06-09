from rest_framework import permissions
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from beekeeper_web_api.jwt_token.serializers import MyTokenObtainPairSerializer, CookieTokenRefreshSerializer


class MyObtainTokenPairView(TokenObtainPairView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = MyTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        # you must call .is_valid() before accessing validated_data
        serializer.is_valid(raise_exception=True)

        # get access and refresh tokens to do what you like with
        access = serializer.validated_data.get("access", None)
        refresh = serializer.validated_data.get("refresh", None)

        # build your response and set cookie
        if access is not None:
            response = Response({"access": access, "refresh": refresh}, status=200)
            response.set_cookie('token', access)
            response.set_cookie('refresh', refresh)
            return response

        return Response({"Error": "Something went wrong"}, status=400)

"""
Добавить блэк лист assess и refresh токенов на случай смены пароля и при авторизации проверять токены
на принадлежность к блэк листу
"""

class CookieTokenRefreshView(TokenRefreshView):
    serializer_class = CookieTokenRefreshSerializer

    def finalize_response(self, request, response, *args, **kwargs):
        if response.data.get('access'):
            response.set_cookie('token', response.data['access'])
            response.delete_cookie('refresh')
        return super().finalize_response(request, response, *args, **kwargs)
