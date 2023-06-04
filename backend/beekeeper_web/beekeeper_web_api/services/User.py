import sys

from django.contrib.postgres.aggregates import ArrayAgg
from rest_framework import status
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response

sys.path.append('.')
from rest_framework.exceptions import NotFound
from online_store.models import UserBalanceChange, Product, MainUser, Category, Type_packaging


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
        basket = user.basket.annotate(favorite_product_list=ArrayAgg('favorite_product'))\
            .values('favorite_product_list', 'name', 'image', 'price', 'id', 'description')
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
    def addBasketProduct(cls, user: MainUser, id: int):
        if user.favorite_product.filter(pk=id).exists():
            return Response({'data': 'данный продукт уже в списке корзины'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            product = get_object_or_404(Product, pk=id)
            user.basket.add(product)
            return Response({'data': 'success'})
    @classmethod
    def removeBasketProduct(cls, user: MainUser, id: int):
        if not user.basket.filter(pk=id).exists():
            return Response({'data': 'данный продукт не в списке корзины'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            product = get_object_or_404(Product, pk=id)
            user.basket.remove(product)
            return Response({'data': 'success'})
        

class ProductServises():
    
    @classmethod
    def getPopular(self, size):
        return Product.objects.all().order_by('count_purchase')[:size]
    
    @classmethod
    def getProductList(self, size):
        return Product.objects.all()[:size]

class CategoryServises():
    
    
    @classmethod
    def getCategoryList(self):
        return Category.objects.all()
    


class Type_packagingServises():
    
    
    @classmethod
    def getCategoryList(self):
        return Type_packaging.objects.all()
    

