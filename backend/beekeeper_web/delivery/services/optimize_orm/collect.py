from typing import Callable

from django.db.models import Prefetch, QuerySet

from delivery.services.optimize_orm.only import default_delivery_only
from orders.models import Order
from orders.services.optimize_orm import default_order_optimize

default_delivery_optimize: Callable[[QuerySet], QuerySet] = lambda x: x.only(*default_delivery_only(),
                                             'order_delivery_transaction') \
    .prefetch_related(Prefetch('order_delivery_transaction',
                               queryset=default_order_optimize(Order.objects.all())
                               )
                      )