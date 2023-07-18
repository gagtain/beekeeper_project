from django.db.models import QuerySet, Prefetch
from rest_framework.views import APIView

from beekeeper_web_api.models import Category, Order, OrderItem
from ..models import DeliveryTransaction
from beekeeper_web_api.Part_API.custom_mixins import Filter
from ..serializers import DeliveryTransactionSerializer


class DeliveryTransactionFilter(APIView, Filter):
    models = DeliveryTransaction
    serializers_retrieve = DeliveryTransactionSerializer

    filter_options = {}

    def init_queryset(self, queryset: QuerySet):
        """Оптимизация запроса"""

        return queryset.only('id','uuid', 'track_number', 'order_delivery_transaction', 'status').prefetch_related(
            Prefetch('order_delivery_transaction',
                     queryset=Order.objects.all().select_related('user')
                     .only('amount', 'amount_currency', 'user__username', 'user__email', 'user__FIO', 'datetime', 'delivery_id')
                     .prefetch_related(
                         Prefetch('product_list_transaction',
                                  queryset=OrderItem.objects.all()
                                  .select_related('productItem', 'productItem__product', 'productItem__weight')
                                  .only('id', 'count', 'order_id', 'productItem__weight', 'productItem__product__name',
                                        'productItem__product__image', 'productItem__product__price', 'productItem__product__price_currency')

                                  )
                     )
                     ))
