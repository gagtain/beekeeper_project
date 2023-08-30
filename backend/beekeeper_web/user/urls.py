from django.urls import path, include
from . import views

urlpatterns = [
    path('token/verif', views.tokenVerif.as_view()),
    path('register', views.UserRegistAPI.as_view()),
    path('image_edit', views.UserAPI.as_view({'post': 'image_edit'})),
    path('number', views.UserAPI.as_view({'get': 'get_user_number'})),
    path('set_token', views.UserAPI.as_view({'post': 'user_set_auth_token'}))

]