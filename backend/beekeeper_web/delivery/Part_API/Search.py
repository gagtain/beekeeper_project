from django.db.models import QuerySet, Prefetch, Count
from rest_framework.views import APIView

from orders.models import Order, OrderItem
from ..models import DeliveryTransaction
from beekeeper_web_api.Part_API.custom_mixins import Filter
from ..serializers import DeliveryTransactionSerializer, CountSerializer


class DeliveryTransactionFilter(APIView, Filter):
    models = DeliveryTransaction
    serializers_retrieve = DeliveryTransactionSerializer
    type_obj = 'model'

    filter_options = {}

    def init_queryset(self, queryset: QuerySet):
        """Оптимизация запроса"""

        return queryset.only('id', 'uuid', 'track_number',
                             'order_delivery_transaction', 'status',
                             'delivery_method', 'where').prefetch_related(
            Prefetch('order_delivery_transaction',
                     queryset=Order.objects.all().select_related('user', 'payment')
                     .only('amount', 'amount_currency', 'user__username', 'user__email', 'user__FIO', 'datetime',
                           'delivery_id', 'user__id', 'status', 'payment')
                     .prefetch_related(
                         Prefetch('product_list_transaction',
                                  queryset=OrderItem.objects.all()
                                  .select_related('productItem', 'productItem__product', 'productItem__dimensions',
                                                  'productItem__weight')
                                  .only('id', 'count', 'order_id', 'productItem__weight', 'productItem__product__name',
                                        'productItem__product__image', 'price',
                                        'price_currency', 'productItem__dimensions')

                                  )
                     )
                     ))


class DeliveryTransactionFilterCount(Filter):
    models = DeliveryTransaction
    serializers_retrieve = CountSerializer

    filter_options = {}

    def search__count(self, *args, **kwargs):
        return super().search(*args, **kwargs)

    def init_queryset(self, queryset):
        return queryset.aggregate(count=Count('*'))
