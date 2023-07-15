from django.urls import path, include
from .. import views
from . import basket_urls, favorite_urls, order_urls, product_urls

urlpatterns = [
    path('getLastOrder', views.UserAPI.as_view({'get': 'GetLastOrder'})),
    path('get_popular_product', views.ProductAPI.as_view({'get': 'get_popular'})),
    path('category', views.CategoryAPI.as_view({'get': 'get_category_list'})),
    path('type_packaging', views.Type_packagingAPI.as_view({'get': 'get_Type_packaging_list'})),
    path('get_csrf', views.setCSRFCookie.as_view()),
    path('token/verif', views.tokenVerif.as_view()),
    path('register', views.UserRegistAPI.as_view()),
    path('get_basket_info', views.UserAPI.as_view({'get': 'GetBasketInfo'})),

]
urlpatterns += basket_urls.urlpatterns + favorite_urls.urlpatterns \
               + order_urls.urlpatterns + product_urls.urlpatterns
