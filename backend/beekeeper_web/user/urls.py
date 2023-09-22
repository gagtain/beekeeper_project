from django.urls import path, include
from . import views

urlpatterns = [
    path('token/verif', views.tokenVerif.as_view(), name='verif'),
    path('register', views.UserRegistAPI.as_view(), name='register'),
    path('image_edit', views.UserAPI.as_view({'post': 'image_edit'})),
    path('number', views.UserAPI.as_view({'get': 'get_user_number'})),
    path('set_token', views.UserAPI.as_view({'post': 'user_set_auth_token'})),
    path('register_auth_token', views.UserAPI.as_view({'post': 'user_register_auth_token',
                                                       'delete': 'user_unregister_auth_token'}))

]