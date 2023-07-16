from django.urls import path, include
from .. import views

urlpatterns = [
    path('order/create', views.OrderAPI.as_view({'post': 'createOrder'})),
    path('order/last', views.OrderAPI.as_view({'get': 'getLastOrder'})),
    path('order/list', views.OrderAPI.as_view({'get': 'getOrderList'}))

]