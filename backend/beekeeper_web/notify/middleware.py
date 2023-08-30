import random

from asgiref.sync import sync_to_async
from channels.middleware import BaseMiddleware
from django.db import close_old_connections

from user.models import MainUser


class TokenAuthMiddleware(BaseMiddleware):

    async def __call__(self, scope, receive, send):
        close_old_connections()
        print(scope)

        scope['user'] = await self.get_user()
        return await super().__call__(scope, receive, send)

    @sync_to_async
    def get_user(self):
        return MainUser.objects.get(id=random.choice([1,3,4]))


def JwtAuthMiddlewareStack(inner):
    return TokenAuthMiddleware(inner)