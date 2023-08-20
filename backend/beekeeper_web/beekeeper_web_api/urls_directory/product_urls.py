from django.urls import path
from .. import views

urlpatterns = [
    path('product', views.ProductAPI.as_view({'get': 'get_product_list'})),
    path('product/<int:id>', views.ProductAPI.as_view({'get': 'get_product'})),
    path('product/<int:product_pk>/rating', views.RatingAPI.as_view({'get': 'list'})),
    path('product/<int:product_pk>/rating/avg', views.RatingAPI.as_view({'get': 'get_rating_avg'})),
    path('product/<int:product_pk>/rating/create', views.RatingAPI.as_view({'post': 'create'})),
    path('product/search/name', views.ProductFilterNameAPI.as_view({'get': 'search'})),
    path('product/search/', views.ProductFilterAPI.as_view({'get': 'search__default'})),

]