from django.urls import path, include
from . import views

urlpatterns = [
    path('getLastOrder', views.UserAPI.as_view({'get':'GetLastOrder'})),
    path('basket', views.UserAPI.as_view({'get':'GetBasket'})),
    path('basket/<int:pk>', views.UserAPI.as_view({'post': 'AddBasketProduct', 'delete': 'RemoveBasketProduct'})),
    path('favorite', views.UserAPI.as_view({'get':'GetFavoriteProduct'})),
    path('favorite/<int:pk>', views.UserAPI.as_view({'post': 'AddFavoriteProduct', 'delete': 'RemoveFavoriteProduct'})),
    path('get_popular_product', views.ProductAPI.as_view({'get': 'get_popular'})),
    path('get_csrf', views.setCSRFCookie.as_view()),
    path('token/verif', views.tokenVerif.as_view())

]