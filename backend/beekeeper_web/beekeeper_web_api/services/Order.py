import decimal
import sys

from django.db.models import QuerySet
from rest_framework import status
from rest_framework.exceptions import NotFound, ValidationError

from global_modules.exception.base import CodeDataException
from orders.models import Order, OrderItem
from orders.services.optimize_orm import default_order_optimize
from ..tasks import order_email_send

sys.path.append('.')
from ..models import MainUser, BasketItem, ProductItem


def try_index_or_default(list_, index, default):
    try:
        return list_[index]
    except:
        return default


class OrderServices():

    @classmethod
    def examination_basket_item_in_user(cls, basket_item_list: list[int,], user: MainUser) -> QuerySet[BasketItem]:
        basket_list = user.basket.filter(pk__in=basket_item_list)
        if not basket_list.count() == len(basket_item_list):
            raise CodeDataException(status=status.HTTP_400_BAD_REQUEST,
                                    error='Не все элементы списка присутствуют в корзине')
        else:
            return basket_list

    @classmethod
    def getLastOrder(cls, user_id: int) -> Order:
        LastOrder = default_order_optimize(Order.objects.filter(user__id=user_id)).last()
        if LastOrder:
            return LastOrder
        else:
            raise CodeDataException(status=status.HTTP_404_NOT_FOUND, error="У пользователя нет заказов")

    @classmethod
    def createOrderInBasket(cls, request, basket_item_list: QuerySet[BasketItem]):
        """Создание заказа"""
        if basket_item_list.count() == 0:
            raise ValidationError(detail='Список товаров пуст')
        total_amount = cls.generate_total_amount(basket_item_list)
        total_amount = total_amount + decimal.Decimal(request.data['delivery_price'])
        order = Order.objects.create(user_id=request.user.id, amount=total_amount)
        cls.generate_order_item(basket_item_list=basket_item_list, user_id=request.user.id, order_id=order.id)
        basket_item_list.delete()
        order_email_send.delay(order.id, request.user.id)

        return order

    @classmethod
    def generate_total_amount(cls, basket_item_list: QuerySet[BasketItem]) -> decimal.Decimal:
        total_amount = decimal.Decimal(0.00)
        for i in basket_item_list:
            total_amount += i.count * i.productItem.price.amount
        return total_amount

    @classmethod
    def generate_order_item(cls, basket_item_list: QuerySet[BasketItem], user_id, order_id):
        for basket_item in basket_item_list:
            OrderItem.objects.create(user_id=user_id, productItem=basket_item.productItem,
                                     count=basket_item.count, order_id=order_id, price=basket_item.productItem.price)

    @classmethod
    def createOrderInList(cls, request, data: list[int,]):
        """ Создание заказа из списка идентификаторов вариантов продукта"""
        ProductItemList = cls.generate_product_item_list(data)
        BasketItemList = cls.generate_basket_item(ProductItemList, [], user=request.user)
        request.user.basket.add(*BasketItemList)
        cls.createOrderInBasket(request=request, basket_item_list=request.user.basket.all())

    @classmethod
    def create_order_in_checkout(cls, checkout_id: int, user_id: int):
        try:
            order = Order.objects.get(id=checkout_id)
        except:
            raise CodeDataException(status=status.HTTP_404_NOT_FOUND,
                                    error='заказа с таким идентификатором не существует')
        if order.status != Order.StatusChoice.checkout:
            raise CodeDataException(status=status.HTTP_400_BAD_REQUEST, error='данный заказ уже оформлен')
        else:
            order.status = Order.StatusChoice.not_approved
            order.save()
            # order_email_send.delay(order.id, user_id)
        return order

    @classmethod
    def generate_product_item_list(cls, data: list[int,], prefetch=False):
        ProductItemList = ProductItem.objects.filter(pk__in=data)
        if not prefetch:
            if ProductItemList.count() != len(data):
                raise CodeDataException(status=status.HTTP_404_NOT_FOUND,
                                        error='В переданном списке присутствуют несуществующие идентификаторы')
        return ProductItemList

    @classmethod
    def generate_basket_item(cls, ProductItemList: QuerySet[ProductItem], count_list: list[int,], **kwargs):
        BasketItemList = BasketItem.objects.bulk_create(
            [
                BasketItem(**kwargs,
                           productItem=x,
                           count=try_index_or_default(count_list, index, 1))
                for index, x in enumerate(ProductItemList)
            ]
        )
        return BasketItemList

    @classmethod
    def getOrderList(cls, user):
        return default_order_optimize(user.user_order.all().order_by('-id'))

    @classmethod
    def checkout_order_create(cls, basket_item_list: QuerySet[BasketItem], user_id: int):
        total_amount = cls.generate_total_amount(basket_item_list)
        order = Order.objects.create(user_id=user_id, amount=total_amount,
                                     status=Order.StatusChoice.checkout)
        cls.generate_order_item(basket_item_list=basket_item_list,
                                user_id=user_id, order_id=order.id)
        return order
