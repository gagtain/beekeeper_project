"""
ASGI config for beekeeper_web project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""

import os

import django
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application

django.setup()
from notify.middleware import JwtAuthMiddlewareStack

from notify import routing as notify_routing

from beekeeper_web_api import routing as online_store_routing
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'beekeeper_web.settings')

application = ProtocolTypeRouter({
  "http": get_asgi_application(),
  "websocket": JwtAuthMiddlewareStack(
        URLRouter(
            notify_routing.websocket_urlpatterns + online_store_routing.websocket_urlpatterns
        )
    ),
})
