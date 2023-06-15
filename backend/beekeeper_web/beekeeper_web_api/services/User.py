import sys

from django.contrib.postgres.aggregates import ArrayAgg
from django.db.models import Prefetch, Sum, Count
from rest_framework import status
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response

sys.path.append('.')
from rest_framework.exceptions import NotFound
from online_store.models import UserBalanceChange, Product, MainUser, Category, Type_packaging, ImageProduct, \
    Type_weight, BasketItem


class ServicesUser:

    @classmethod
    def getLastOrder(cls, user_id: int) -> UserBalanceChange:
        LastOrder = UserBalanceChange.objects.filter(user__id=user_id).last()
        if LastOrder:
            return LastOrder
        else:
            raise NotFound("У пользователя нет заказов")

    @classmethod
    def getBasket(cls, user: MainUser) -> list[Product]:
        basket = user.basket.prefetch_related(
            Prefetch('type_packaging', queryset=Type_packaging.objects.all().only('name')),
            Prefetch('favorite_product', queryset=MainUser.objects.all().only('id')),
           'list_weight',
        )
        return basket

    @classmethod
    def getFavoriteProduct(cls, user: MainUser) -> list[Product]:
        favorite_product = user.favorite_product
        return favorite_product

    @classmethod
    def addFavoriteProduct(cls, user: MainUser, id: int):
        if user.favorite_product.filter(pk=id).exists():
            return Response({'data': 'данный продукт уже в списке избранных'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            product = get_object_or_404(Product, pk=id)
            user.favorite_product.add(product)
            return Response({'data': 'success'})
    @classmethod
    def removeFavoriteProduct(cls, user: MainUser, id: int):
        if not user.favorite_product.filter(pk=id).exists():
            return Response({'data': 'данный продукт не в списке избранных'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            product = get_object_or_404(Product, pk=id)
            user.favorite_product.remove(product)
            return Response({'data': 'success'})


    @classmethod
    def addBasketProduct(cls, request, id: int):
        user: MainUser = request.user
        if user.basket.filter(pk=id).exists():
            return Response({'data': 'данный продукт уже в списке корзины'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            product = get_object_or_404(Product, pk=id)
            packaging = get_object_or_404(Type_packaging, pk=request.data['packaging'])
            type_weight = get_object_or_404(Type_weight, pk=request.data['type_weight'])
            BasketItem.objects.create(user=user,product=product, weight=type_weight, type_packaging=packaging)

            return Response({'data': 'success'})
    @classmethod
    def removeBasketProduct(cls, user: MainUser, id: int):
        if not user.basket.filter(pk=id).exists():
            return Response({'data': 'данный продукт не в списке корзины'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            product = get_object_or_404(Product, pk=id)
            user.basket.remove(product)
            return Response({'data': 'success'})


    @classmethod
    def getBasketInfo(cls, user: MainUser):
        """ кол-во товаров, общая сумма  """
        basket_info = user.basket.only('price').aggregate(summ=Sum('price'), count=Count('basket'))
        return basket_info

class ProductServises():
    
    @classmethod
    def getPopular(self, size):
        return Product.objects.all().order_by('count_purchase')[:size]
    
    @classmethod
    def getProductList(self, size):
        return Product.objects.all()[:size].prefetch_related(
            Prefetch('category', queryset=Category.objects.all().only('name')),
            Prefetch('type_packaging', queryset=Type_packaging.objects.all().only('name')),
           'ImageProductList','list_weight'
        )
    
    # 'id', 'name', 'image', 'price', 'description', 'price_currency', 'category', 'type_packaging', 'ImageProductList'
    @classmethod
    def getProduct(self, pk):
        return Product.objects.filter(pk=pk).prefetch_related(
            Prefetch('category', queryset=Category.objects.all().only('name')),
            Prefetch('type_packaging', queryset=Type_packaging.objects.all().only('name')),
           'ImageProductList','list_weight'
        )

class CategoryServises():
    
    
    @classmethod
    def getCategoryList(self):
        return Category.objects.all()
    


class Type_packagingServises():
    
    
    @classmethod
    def getCategoryList(self):
        return Type_packaging.objects.all()
    

