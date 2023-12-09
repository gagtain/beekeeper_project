from django.urls import path

from notify.consumers import NotifyConsumers

websocket_urlpatterns = [
    path('api/v0.1/notify', NotifyConsumers.as_asgi())
]