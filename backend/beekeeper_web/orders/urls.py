
from django.urls import path
from .views import OrdersSearchAPI, OrderSearchSum, OrderSearchCount, OrderAPI, OrderRestartAPI

urlpatterns = [
    path('search/sum', OrderSearchSum.as_view({'get': 'search__sum'})),
    path('search/count', OrderSearchCount.as_view({'get': 'search__count'})),
    path('search/', OrdersSearchAPI.as_view({'get': 'search'})),
    path('<int:pk>', OrderAPI.as_view({'get': 'retrieve'})),
    path('<int:pk>/approved', OrderAPI.as_view({'post': 'approved'})),
    path('<int:pk>/closed', OrderAPI.as_view({'post': 'closed'})),
    path('<int:pk>/restart', OrderRestartAPI.as_view({'post': 'restart'}))
]
