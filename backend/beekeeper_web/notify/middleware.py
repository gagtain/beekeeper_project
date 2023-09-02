import datetime
import random

from asgiref.sync import sync_to_async
from channels.middleware import BaseMiddleware
from channels.sessions import SessionMiddlewareStack
from django.contrib.auth.models import AnonymousUser
from django.db import close_old_connections
from django.http import parse_cookie
from rest_framework_simplejwt.settings import api_settings

from user.jwt_token.auth import CustomAuthentication
from user.models import MainUser

class TokenAuthMiddleware(BaseMiddleware, CustomAuthentication):
    user_model = MainUser

    async def __call__(self, scope, receive, send):
        close_old_connections()
        result = await sync_to_async(self.authenticate)(request=scope)
        if result is not None:
            result = await result[0]
            scope['user'] = result
        return await super().__call__(scope, receive, send)

    def get_cookies(self, request):
        for name, value in request.get("headers", []):
            if name == b"cookie":
                cookies = parse_cookie(value.decode("latin1"))
                break
        else:
            cookies = {}
        return cookies

    def get_header(self, request):
        header = {}
        for name, value in request.get("headers", []):

            header[name] = value
        header = header.get(b"authorization")
        return header

    @sync_to_async
    def get_user(self, validated_token):
        user = super().get_user(validated_token)
        return user


def JwtAuthMiddlewareStack(inner):
    return TokenAuthMiddleware(inner)