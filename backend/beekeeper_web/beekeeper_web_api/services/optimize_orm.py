from django.db.models import Prefetch

from beekeeper_web_api.models import ProductItem
from user.services.optimize_orm import optimize_category, optimize_ImageProductList

optimize_product_item_list = lambda x: Prefetch(x, queryset=ProductItem.objects.all().only(
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
    'price'
).select_related('dimensions', 'weight'))
