from django.urls import path

from beekeeper_web_api.consumers import ProductConsumers

websocket_urlpatterns = [
    path('/ws/api/v0.1/online_store', ProductConsumers.as_asgi())
]