from django.db.models import QuerySet, Prefetch, Count, Sum
from rest_framework.views import APIView

from orders.models import Order
from beekeeper_web_api.Part_API.custom_mixins import Filter
from beekeeper_web_api.serializers import OrderSerializers
from delivery.serializers import CountSerializer
from orders.serializers import SumSerializer


class OrderFilter(APIView, Filter):
    models = Order
    serializers_retrieve = OrderSerializers
    type_obj = 'model'

    filter_options = {}

    def init_queryset(self, queryset: QuerySet):
        """Оптимизация запроса"""

        return queryset


class OrderFilterCount(Filter):
    models = Order
    serializers_retrieve = CountSerializer

    filter_options = {}

    def search__count(self, *args, **kwargs):
        return super().search(*args, **kwargs)

    def init_queryset(self, queryset):
        return queryset.aggregate(count=Count('*'))


class OrderFilterSum(Filter):
    models = Order
    serializers_retrieve = SumSerializer

    filter_options = {}

    def search__sum(self, *args, **kwargs):
        return super().search(*args, **kwargs)

    def init_queryset(self, queryset):
        return queryset.aggregate(sum=Sum('amount'))
