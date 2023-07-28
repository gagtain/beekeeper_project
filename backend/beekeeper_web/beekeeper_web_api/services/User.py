import sys

from django.contrib.postgres.aggregates import ArrayAgg
from django.db.models import Prefetch, Sum, Count, Avg
from rest_framework import status
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response

from beekeeper_web_api.serializers import BasketSerializer, FavoriteSerializer

sys.path.append('.')
from rest_framework.exceptions import NotFound
from ..models import Product, MainUser, Category, ImageProduct, \
    Type_weight, BasketItem, ProductItem, FavoriteItem


class ServicesUser:



    @classmethod
    def getBasket(cls, user: MainUser) -> list[Product]:
        basket = user.basket.prefetch_related(
            Prefetch('favorite_product', queryset=MainUser.objects.all().only('id')),
            'list_weight',
        )
        return basket

    @classmethod
    def getFavoriteProduct(cls, user: MainUser) -> list[Product]:
        favorite_product = user.favorite_product
        return favorite_product

    @classmethod
    def addFavoriteProduct(cls, request, id: int):
        user: MainUser = request.user
        if user.favorite_product.filter(productItem_id=id).exists():
            return Response({'data': 'данный продукт уже в списке избранных'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            FavoriteAddItem = FavoriteItem.objects.create(user_id=user.id, productItem_id=id)
            return Response({'data': 'success', 'favoriteItem': FavoriteSerializer(FavoriteAddItem).data})

    @classmethod
    def removeFavoriteProduct(cls, request, id: int):
        user: MainUser = request.user
        favorite_item = user.favorite_product.filter(productItem_id=id)
        if favorite_item:
            favorite_item.delete()
            return Response({'data': 'success', 'id': id})
        else:
            return Response({'data': 'данный продукт уже в списке избранных'}, status=status.HTTP_400_BAD_REQUEST)

    @classmethod
    def addBasketProduct(cls, request, id: int):
        user: MainUser = request.user
        if user.basket.filter(productItem_id=id).exists():
            return Response({'data': 'данный продукт уже в списке корзины'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            BasketAddItem = BasketItem.objects.create(user_id=user.id, productItem_id=id)
            return Response({'data': 'success', 'basketItem': BasketSerializer(BasketAddItem).data})

    @classmethod
    def removeBasketProduct(cls, user: MainUser, pk):
        basketFilterList = user.basket.filter(productItem_id=pk)
        if not basketFilterList:
            return Response({'data': 'данный продукт не в списке корзины'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            basketFilterList[0].delete()
            return Response({'data': 'success', 'id': pk})

    @classmethod
    def getBasketInfo(cls, user: MainUser):
        """ количество товаров, общая сумма  """
        basket_info = user.basket.only('price').aggregate(summ=Sum('price'), count=Count('basket'))
        return basket_info

    @classmethod
    def updateBasketItemCount(cls, basket_id, user, count):
        basketItemList = BasketItem.objects.filter(pk=basket_id, user=user.id)
        if basketItemList.count() == 0:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={'error': 'данного товара в корзине нету'})
        else:
            basketItem = basketItemList[0]
            basketItem.count = count
            print(count, basketItem.count, basketItem)
            basketItem.save()
            return Response(BasketSerializer(basketItem).data)


class ProductServises():

    @classmethod
    def getPopular(cls, size):
        return Product.objects.all().order_by('count_purchase')[:size].prefetch_related(
            Prefetch('category', queryset=Category.objects.all().only('name')),
            'ImageProductList'
        ).annotate(Avg('rating_product__rating'))

    @classmethod
    def getProductList(cls, size):
        return Product.objects.all()[:size].prefetch_related(
            Prefetch('category', queryset=Category.objects.all().only('name')),
            'ImageProductList'
        ).annotate(Avg('rating_product__rating'))

    # 'id', 'name', 'image', 'price', 'description', 'price_currency', 'category', 'type_packaging', 'ImageProductList'
    @classmethod
    def getProduct(cls, pk):
        return Product.objects.filter(pk=pk).prefetch_related(
            Prefetch('category', queryset=Category.objects.all().only('name')),
            'ImageProductList'
        ).annotate(Avg('rating_product__rating'))


class CategoryServises():

    @classmethod
    def getCategoryList(cls):
        return Category.objects.all()

