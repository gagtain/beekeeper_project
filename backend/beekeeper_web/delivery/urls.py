"""
URL configuration for beekeeper_web project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls_directory import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls_directory'))
"""
from django.contrib import admin
from django.urls import path

from payments.views import PaymentAPI
from . import views

urlpatterns = [
    path('initial/', views.DeliveryAPI.as_view({'post': 'delivery_initial_in_data'})),
    path('create/lait', views.DeliveryAPI.as_view({'get': 'delivery_create_lait'})),
    path('sdek/<str:uuid>', views.DeliveryAPI.as_view({'get': 'delivery_sdek_get'})),
    path('<int:pk>', views.DeliveryAPI.as_view({'get': 'delivery_get'})),
    path('<int:pk>/submit/waiting', views.DeliveryAPI.as_view({'post': 'delivery_submit_waiting'})),
    path('<int:pk>/track_number', views.DeliveryAPI.as_view({'post': 'delivery_track_add'})),
    path('<int:pk>/get_info_in_order', views.DeliveryInfoAPI.as_view({'post': 'get_info_in_order'})),
    path('search', views.DeliveryAPI.as_view({'get': 'search'})),
    path('search/count', views.DeliverySearchCountAPI.as_view({'get': 'search__count'})),
]