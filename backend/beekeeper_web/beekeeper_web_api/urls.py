from django.urls import path, include
from . import views

urlpatterns = [
    path('getLastOrder', views.UserAPI.as_view({'get':'GetLastOrder'})),
    path('basket', views.UserAPI.as_view({'get':'GetBasket'})),
    path('basket/<int:pk>', views.UserAPI.as_view({'post': 'AddBasketProduct', 'delete': 'RemoveBasketProduct'})),
    path('favorite', views.UserAPI.as_view({'get':'GetFavoriteProduct'})),
    path('favorite/<int:pk>', views.UserAPI.as_view({'post': 'AddFavoriteProduct', 'delete': 'RemoveFavoriteProduct'})),
    path('get_popular_product', views.ProductAPI.as_view({'get': 'get_popular'})),
    path('product', views.ProductAPI.as_view({'get': 'get_product_list'})),
    path('basket/<int:basket_pk>/update_count', views.UserAPI.as_view({'post': 'UpdateBasketItemCount'})),
    path('product/<int:id>', views.ProductAPI.as_view({'get': 'get_product'})),
    path('product/<int:product_pk>/rating', views.RatingAPI.as_view({'get': 'list'})),
    path('product/<int:product_pk>/rating/avg', views.RatingAPI.as_view({'get': 'get_rating_avg'})),
    path('product/<int:product_pk>/rating/create', views.RatingAPI.as_view({'post': 'create'})),
    path('product/search/name', views.ProductAPI.as_view({'get': 'search__name'})),
    path('product/search/', views.ProductFilterAPI.as_view({'get': 'search__default'})),
    path('category', views.CategoryAPI.as_view({'get': 'get_category_list'})),
    path('get_csrf', views.setCSRFCookie.as_view()),
    path('token/verif', views.tokenVerif.as_view()),
    path('register', views.UserRegistAPI.as_view()),
    path('get_basket_info', views.UserAPI.as_view({'get': 'GetBasketInfo'})),
    path('order/create', views.OrderAPI.as_view({'post': 'createOrder'})),
    path('order/last', views.OrderAPI.as_view({'get': 'getLastOrder'})),
    path('order/list', views.OrderAPI.as_view({'get': 'getOrderList'}))

]