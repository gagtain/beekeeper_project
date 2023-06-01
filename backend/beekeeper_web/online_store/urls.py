from django.urls import path, include
from . import views
from .views import views, AuthViews

urlpatterns = [
    path('', views.index, name="home"),
    path('catalog/', views.catalog),
    path("registry/", AuthViews.RegistrationView.as_view(), name="registry"),
    path("profile", views.profile, name="profile"),
    path("basket/", views.basket, name="basket")

]
