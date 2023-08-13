from django.db.models import QuerySet, Prefetch, Count, Sum
from rest_framework.views import APIView

from orders.models import Order, OrderItem
from beekeeper_web_api.Part_API.custom_mixins import Filter
from delivery.serializers import CountSerializer
from orders.serializers import SumSerializer, OrderSerializers
from orders.services.optimize_orm import default_order_optimize


class OrderFilter(APIView, Filter):
    models = Order
    serializers_retrieve = OrderSerializers
    type_obj = 'model'
    skip_params = ['size', 'from']

    filter_options = {}

    def init_queryset(self, queryset: QuerySet):
        """Оптимизация запроса"""

        size = int(self.request.GET.get('size', 10))
        from_ = int(self.request.GET.get('from', 0))
        return default_order_optimize(queryset[from_:from_ + size])


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
