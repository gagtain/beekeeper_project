from django.db.models import QuerySet, Prefetch

from beekeeper_web_api.models import FavoriteItem, BasketItem
from user.models import MainUser
from user.services.OnlyOptimize import OnlyOptimize


def optimize_product(obj: OnlyOptimize, field: str):
    """ field: поле содержащее ForeignKey Productitem """
    obj._query = obj._query.select_related(field).prefetch_related(f'{field}__ImageProductList')
    obj.add_only(f'{field}__name', f'{field}__id', f'{field}__description',
                 f'{field}__image', f'{field}__count_purchase', f'{field}__id', f'{field}__ImageProductList')
    return obj