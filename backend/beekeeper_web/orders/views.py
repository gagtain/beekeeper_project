from django.shortcuts import render
from rest_framework.viewsets import ViewSet

from orders.Part_API.OrderApproved import OrderApproved
from orders.Part_API.OrderSearch import OrderFilterSum, OrderFilter, OrderFilterCount


# Create your views here.

class OrderAPI(ViewSet, OrderApproved):
    pass


class OrderSearchSum(ViewSet, OrderFilterSum):
    pass


class OrderSearchCount(ViewSet, OrderFilterCount):
    pass


class OrdersSearchAPI(ViewSet, OrderFilter):
    pass
