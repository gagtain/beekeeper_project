from django.db.models import QuerySet, Prefetch

from beekeeper_web_api.models import FavoriteItem, BasketItem, Category, ImageProduct
from delivery.services.optimize_orm.only import default_delivery_only
from orders.models import OrderItem
from payments.services.optimize_orm import default_payment_only
from user.services.optimize_orm import default_user_only, default_productItem_only, default_productItem_select_related, \
    optimize_category, optimize_ImageProductList

default_order_only = ('id', 'amount', 'amount_currency', 'user', 'product_list_transaction',
                      'datetime', 'delivery', 'payment', 'status')


default_order_optimize = lambda x: x.select_related('user', 'payment', 'delivery') \
            .only(*default_user_only('user')).prefetch_related(Prefetch(
            'product_list_transaction', queryset=OrderItem.objects.all().only(
                'id', 'productItem', 'count', 'price', 'price_currency', 'order_id',
        *default_productItem_only("productItem")
            ).select_related(*default_productItem_select_related("productItem"))
            .prefetch_related(optimize_category('productItem__product'),
                              optimize_ImageProductList('productItem__product'))
        )).only(*default_order_only, 'id', *default_payment_only('payment'), *default_delivery_only('delivery'))