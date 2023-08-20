from django.urls import path
from .. import views

urlpatterns = [
    path('favorite', views.FavoriteProductAPI.as_view({'get': 'GetFavoriteProduct'})),
    path('favorite/<int:pk>', views.FavoriteProductAPI.as_view({'post': 'AddFavoriteProduct',
                                                                'delete': 'RemoveFavoriteProduct'})),

]
