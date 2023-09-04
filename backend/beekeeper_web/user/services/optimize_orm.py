from django.db.models import QuerySet, Prefetch

from beekeeper_web_api.models import FavoriteItem, BasketItem, Category, ImageProduct


def default_user_only(x=None):
    return (f'{x}__username', f'{x}__FIO', f'{x}__is_sending', f'{x}__image') if x \
        else ('username', 'FIO', 'is_sending', 'image')


def default_productItem_only(x=None):
    return (f'{x}', f'{x}_id',
            f'{x}__product_id',
            f'{x}__product',
            f'{x}__product__name',
            f'{x}__product__image',
            f'{x}__product__description',
            f'{x}__weight',
            f'{x}__weight__weight',
            f'{x}__weight_id',
            f'{x}__price_currency',
            f'{x}__dimensions_id',
            f'{x}__price',) if x \
        else ('id',
              'product_id',
              'product',
              'product__name',
              'product__image',
              'product__description',
              'weight',
              'weight__weight',
              'weight_id',
              'price_currency',
              'dimensions_id',
              'price',)


def default_productItem_select_related(x=None):
    return (f'{x}', f'{x}__product',
            f'{x}__weight', f'{x}__dimensions') if x else (
        'product',
        'weight', 'dimensions')

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


optimize_favorite_item = lambda x: x.only(*default_productItem_only("productItem"), 'user_id',
                                          'productItem__product__productItemList') \
    .select_related(*default_productItem_select_related("productItem")) \
    .prefetch_related(optimize_category('productItem__product'),
                      optimize_ImageProductList('productItem__product'))

optimize_favorite = Prefetch('favorite_product',
                             queryset=optimize_favorite_item(FavoriteItem.objects.all())

                             )
optimize_basket_item = lambda x: x.only('count', *default_productItem_only("productItem"), 'user_id',
                                        'productItem__product__productItemList') \
    .select_related(*default_productItem_select_related("productItem")) \
    .prefetch_related(optimize_category('productItem__product'),
                      optimize_ImageProductList('productItem__product'))

optimize_basket = Prefetch('basket',
                           queryset=optimize_basket_item(BasketItem.objects.all())
                           )
