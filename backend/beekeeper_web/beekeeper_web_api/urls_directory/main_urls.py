from django.urls import path
from .. import views

urlpatterns = [
    path('category', views.CategoryAPI.as_view({'get': 'get_category_list'})),
    path('text', views.CategoryAPI.as_view({'get': 'get_text'})),

]
