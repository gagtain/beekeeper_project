
from django.urls import path

from sending.views import SendingAPI

urlpatterns = [
    path('manager', SendingAPI.as_view({'post': 'add_user_sending', 'delete': 'remove_user_sending'})),
]
