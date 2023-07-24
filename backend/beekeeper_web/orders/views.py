from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ViewSet

from beekeeper_web_api.jwt_token.auth import CustomAuthentication
from orders.Part_API.OrderApproved import OrderApproved
from orders.Part_API.OrderClosed import OrderClosed
from orders.Part_API.OrderRestart import OrderRestart
from orders.Part_API.OrderRetrieve import OrderRetrieve
from orders.Part_API.OrderSearch import OrderFilterSum, OrderFilter, OrderFilterCount


# Create your views here.

class OrderRestartAPI(ViewSet, OrderRestart):
    permission_classes = [IsAuthenticated]
    authentication_classes = [CustomAuthentication]
    pass


class OrderAPI(ViewSet, OrderApproved, OrderClosed, OrderRetrieve):
    pass


class OrderSearchSum(ViewSet, OrderFilterSum):
    pass


class OrderSearchCount(ViewSet, OrderFilterCount):
    pass


class OrdersSearchAPI(ViewSet, OrderFilter):
    pass
