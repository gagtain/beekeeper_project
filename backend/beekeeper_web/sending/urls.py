
from django.urls import path

from sending.views import SendingAPI

urlpatterns = [
    path('add', SendingAPI.as_view({'get': 'add_user_sending'})),
    path('remove', SendingAPI.as_view({'get': 'remove_user_sending'})),
]
