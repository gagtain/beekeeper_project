from typing import Callable

from django.db.models import Prefetch, QuerySet

from beekeeper_web_api.models import ProductItem
from user.services.optimize_orm import optimize_category, optimize_ImageProductList

optimize_product_item = lambda x: x.only(
    'product_id',
    'weight',
    'weight__weight',
    'weight_id',
    'price_currency',
    'dimensions_id',
    'dimensions__width',
    'dimensions__height',
    'dimensions__length',
    'dimensions__weight',
    'dimensions',
    'price',
    'is_sale',
    'old_price',
    'old_price_currency'
).select_related('dimensions', 'weight')


optimize_product_item_list = lambda x: Prefetch(x, queryset=optimize_product_item(ProductItem.objects.all()))
