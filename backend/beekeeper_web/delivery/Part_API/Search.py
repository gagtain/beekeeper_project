from django.db.models import QuerySet, Prefetch, Count
from drf_yasg.utils import swagger_auto_schema
from rest_framework.views import APIView

from orders.models import Order, OrderItem
from ..models import DeliveryTransaction
from beekeeper_web_api.Part_API.custom_mixins import Filter
from ..serializers import DeliveryTransactionSerializer, CountSerializer
from ..services.optimize_orm.collect import default_delivery_optimize


class DeliveryTransactionFilter(APIView, Filter):
    models = DeliveryTransaction
    serializers_retrieve = DeliveryTransactionSerializer
    type_obj = 'model'
    skip_params = ['size', 'from']
    filter_options = {}

    @swagger_auto_schema(tags=['delivery'])
    def search(self, request):
        return super().search(request=request)

    def init_queryset(self, queryset: QuerySet):
        """Оптимизация запроса"""
        size = int(self.request.GET.get('size', 10))
        from_ = int(self.request.GET.get('from', 0))
        return default_delivery_optimize(queryset.order_by('id')[from_:from_+size])


class DeliveryTransactionFilterCount(Filter):
    models = DeliveryTransaction
    serializers_retrieve = CountSerializer

    filter_options = {}

    @swagger_auto_schema(tags=['delivery'])
    def search__count(self, *args, **kwargs):
        return super().search(*args, **kwargs)

    def init_queryset(self, queryset):
        return queryset.aggregate(count=Count('*'))
