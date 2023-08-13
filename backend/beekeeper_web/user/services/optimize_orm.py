from django.db.models import QuerySet, Prefetch

from beekeeper_web_api.models import FavoriteItem, BasketItem, Category, ImageProduct


def default_user_only(x=None):
    return (f'{x}__username', f'{x}__FIO', f'{x}__is_sending', f'{x}__image') if x \
        else ('username', 'FIO', 'is_sending', 'image')


def default_productItem_only(x=None):
    return (f'{x}__productItem', f'{x}__productItem_id',
            f'{x}__productItem__product_id',
            f'{x}__productItem__product',
            f'{x}__productItem__product__name',
            f'{x}__productItem__product__image',
            f'{x}__productItem__product__description',
            f'{x}__productItem__weight',
            f'{x}__productItem__weight__weight',
            f'{x}__productItem__weight_id',
            f'{x}__productItem__price_currency',
            f'{x}__productItem__dimensions_id',
            f'{x}__productItem__price',) if x \
        else ('productItem', 'productItem_id',
              'productItem__product_id',
              'productItem__product',
              'productItem__product__name',
              'productItem__product__image',
              'productItem__product__description',
              'productItem__weight',
              'productItem__weight__weight',
              'productItem__weight_id',
              'productItem__price_currency',
              'productItem__dimensions_id',
              'productItem__price',)


def default_productItem_select_related(x=None):
    return (f'{x}__productItem', f'{x}__productItem__product',
            f'{x}__productItem__weight', f'{x}__productItem__dimensions') if x else (
        'productItem', 'productItem__product',
        'productItem__weight', 'productItem__dimensions')

def optimize_ImageProductList(x=None):
    return Prefetch(f'{x}__ImageProductList',
                                     ImageProduct.objects.all().only('photo', 'product_id')) if x else \
        Prefetch('ImageProductList',
                 ImageProduct.objects.all().only('photo', 'product_id'))



def optimize_category(x=None):
    return Prefetch(f'{x}__category',
                    queryset=Category.objects.all().only('name', )) if x else \
        Prefetch('category',
                 queryset=Category.objects.all().only('name', ))


optimize_favorite_item = lambda x: x.only(*default_productItem_only(), 'user_id',
                                          'productItem__product__productItemList') \
    .select_related(*default_productItem_select_related()) \
    .prefetch_related(optimize_category('productItem__product'),
                      optimize_ImageProductList('productItem__product'))

optimize_favorite = Prefetch('favorite_product',
                             queryset=optimize_favorite_item(FavoriteItem.objects.all())

                             )
optimize_basket_item = lambda x: x.only('count', *default_productItem_only(), 'user_id',
                                        'productItem__product__productItemList') \
    .select_related(*default_productItem_select_related()) \
    .prefetch_related(optimize_category('productItem__product'),
                      optimize_ImageProductList('productItem__product'))

optimize_basket = Prefetch('basket',
                           queryset=optimize_basket_item(BasketItem.objects.all())
                           )
