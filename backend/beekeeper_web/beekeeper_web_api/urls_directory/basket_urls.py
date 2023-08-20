from django.urls import path
from .. import views

urlpatterns = [
    path('basket', views.BasketAPI.as_view({'get': 'GetBasket'})),
    path('basket/<int:pk>', views.BasketAPI.as_view({'post': 'add_basket_product', 'delete': 'remove_basket_product'})),
    path('basket/<int:basket_pk>/update_count', views.BasketAPI.as_view({'post': 'update_basket_item_count'})),
    path('get_basket_info', views.BasketAPI.as_view({'get': 'get_basket_info'})),
]
