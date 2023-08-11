from django.urls import path
from .. import views

urlpatterns = [
    path('get_popular_product', views.ProductAPI.as_view({'get': 'get_popular'})),
    path('category', views.CategoryAPI.as_view({'get': 'get_category_list'})),
    path('get_csrf', views.setCSRFCookie.as_view()),

]
