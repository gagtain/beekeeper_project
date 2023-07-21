from django.urls import path, include
from .. import views

urlpatterns = [
    path('basket', views.UserAPI.as_view({'get': 'GetBasket'})),
    path('basket/<int:pk>', views.UserAPI.as_view({'post': 'AddBasketProduct', 'delete': 'RemoveBasketProduct'})),
    path('basket/<int:basket_pk>/update_count', views.UserAPI.as_view({'post': 'UpdateBasketItemCount'})),
]
