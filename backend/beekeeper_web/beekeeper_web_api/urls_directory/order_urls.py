from django.urls import path
from .. import views

urlpatterns = [
    path('order/create', views.OrderAPI.as_view({'post': 'createOrder'})),
    path('order/last', views.OrderAPI.as_view({'get': 'getLastOrder'})),
    path('order/list', views.OrderAPI.as_view({'get': 'getOrderList'})),
    path('order/checkout', views.OrderAPI.as_view({'post': 'checkout_order_in_data'}))

]