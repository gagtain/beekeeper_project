from typing import Tuple

from django.core.paginator import PageNotAnInteger, EmptyPage, Paginator, Page

from ..models import Product


class ServicesProduct:

    @classmethod
    def getPopular(cls, size: int) -> list[Product] :

        popular_product = Product.objects.all().order_by('count_purchase')[:size]
        return popular_product

    @classmethod
    def getPageCatalog(cls, page: int) -> tuple[list[Product], int]:
        object_list = Product.objects.all()
        paginator = Paginator(object_list, 12)
        page = page
        try:
            products = paginator.page(page)
        except PageNotAnInteger:
            products = paginator.page(1)
        except EmptyPage:
            products = paginator.page(paginator.num_pages)

        return products, paginator.num_pages
