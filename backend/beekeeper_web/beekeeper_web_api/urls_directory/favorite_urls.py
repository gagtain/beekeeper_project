from django.urls import path
from .. import views

urlpatterns = [
    path('favorite', views.UserAPI.as_view({'get': 'GetFavoriteProduct'})),
    path('favorite/<int:pk>', views.UserAPI.as_view({'post': 'AddFavoriteProduct', 'delete': 'RemoveFavoriteProduct'})),

]
