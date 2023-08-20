import sys

from django.conf import settings
from django.contrib.postgres.aggregates import ArrayAgg
from django.db.models import Prefetch, Sum, Count, Avg, QuerySet
from rest_framework import status
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response

from beekeeper_web_api.serializers import BasketSerializer, FavoriteSerializer
from global_modules.exception.base import CodeDataException
from user.services.optimize_orm import optimize_basket_item, optimize_favorite_item, optimize_ImageProductList, \
    optimize_category
from .optimize_orm import optimize_product_item_list

sys.path.append('.')
from rest_framework.exceptions import NotFound
from ..models import Product, MainUser, Category, ImageProduct, \
    Type_weight, BasketItem, ProductItem, FavoriteItem


class ServicesUser:

    @classmethod
    def getBasket(cls, user: MainUser) -> list[Product]:
        basket = optimize_basket_item(user.basket)
        return basket

    @classmethod
    def getFavoriteProduct(cls, user: MainUser) -> list[Product]:
        favorite_product = optimize_favorite_item(user.favorite_product)
        return favorite_product

    @classmethod
    def addFavoriteProduct(cls, user: MainUser, id: int) -> FavoriteItem:
        if user.favorite_product.filter(productItem_id=id).exists():
            raise CodeDataException(status=status.HTTP_400_BAD_REQUEST, error='данный продукт уже в списке избранных')
        else:
            FavoriteAddItem = FavoriteItem.objects.create(user_id=user.id, productItem_id=id)
            return FavoriteAddItem

    @classmethod
    def removeFavoriteProduct(cls, user, id: int) -> dict:
        try:
            favorite_item = user.favorite_product.get(productItem_id=id)
        except:
            raise CodeDataException(status=status.HTTP_400_BAD_REQUEST,
                                    error='данный продукта нету в списке избранных')
        favorite_item.delete()
        return {'data': 'success', 'id': id}

    @classmethod
    def addBasketProduct(cls, user: MainUser, product_item_id: int):
        if user.basket.filter(productItem_id=product_item_id).exists():
            raise CodeDataException(status=status.HTTP_400_BAD_REQUEST,
                                    error='данный продукт уже в списке корзины')
        else:
            basket_add_item = BasketItem.objects.create(user_id=user.id, productItem_id=product_item_id)
            return basket_add_item

    @classmethod
    def removeBasketProduct(cls, user_id: int, pk: int) -> dict:
        try:
            basket_item = BasketItem.objects.get(productItem_id=pk, user_id=user_id)
        except:
            raise CodeDataException(status=status.HTTP_400_BAD_REQUEST,
                                    error='данный продукт не в списке корзины')
        basket_item.delete()
        data = {'data': 'success', 'id': pk}
        return data

    @classmethod
    def getBasketInfo(cls, user: MainUser):
        """ Количество товаров, общая сумма  """
        basket_info = user.basket.only('price').aggregate(summ=Sum('price'), count=Count('basket'))
        return basket_info

    @classmethod
    def updateBasketItemCount(cls, basket_id, count):
        try:
            basket_item = BasketItem.objects.get(pk=basket_id)
        except:
            raise CodeDataException(status=status.HTTP_404_NOT_FOUND, error='данного объекта не существует')
        basket_item.count = count
        basket_item.save()
        return basket_item

    @classmethod
    def user_in_basket(cls, basket_id: int, user_id: int) -> bool:
        if BasketItem.objects.filter(pk=basket_id, user_id=user_id).exists():
            return True
        else:
            return False


class ProductServises():

    @classmethod
    def getPopular(cls, size):
        return Product.objects.all().order_by('count_purchase')[:size].prefetch_related(
            optimize_ImageProductList(), optimize_category(),
            optimize_product_item_list('productItemList')
        ).annotate(Avg('rating_product__rating'))

    @classmethod
    def getProductList(cls, size):
        return Product.objects.all()[:size].prefetch_related(
            optimize_category(),
            optimize_ImageProductList(), optimize_product_item_list('productItemList')
        ).annotate(Avg('rating_product__rating'))

    @classmethod
    def getProduct(cls, pk):
        try:
            return Product.objects.prefetch_related(
                optimize_category(),
                optimize_ImageProductList(), optimize_product_item_list('productItemList')
            ).annotate(Avg('rating_product__rating')).get(pk=pk)
        except:
            raise CodeDataException(status=status.HTTP_404_NOT_FOUND, error='объект не существует')


class CategoryServises():

    @classmethod
    def getCategoryList(cls) -> QuerySet:
        return Category.objects.all()
