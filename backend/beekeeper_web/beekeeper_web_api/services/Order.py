import decimal
import sys

from django.db.models import QuerySet
from rest_framework.exceptions import NotFound, ValidationError

from orders.models import Order, OrderItem
from orders.services.optimize_orm import default_order_optimize
from ..tasks import order_email_send

sys.path.append('.')
from ..models import MainUser, BasketItem, ProductItem


class OrderServices():

    @classmethod
    def getLastOrder(cls, user_id: int) -> Order:
        LastOrder = default_order_optimize(Order.objects.filter(user__id=user_id).last())
        if LastOrder:
            return LastOrder
        else:
            raise NotFound("У пользователя нет заказов")

    @classmethod
    def createOrderInBasket(cls, request, basket_item_list: QuerySet[BasketItem]):
        """Создание заказа"""
        if basket_item_list.count() == 0:
            raise ValidationError(detail='Список товаров пуст')
        total_amount = 0

        for i in basket_item_list:
            total_amount += i.count * i.productItem.price.amount
        total_amount = total_amount + decimal.Decimal(request.data['delivery_price'])
        order = Order.objects.create(user=request.user, amount=total_amount)
        for basket_item in basket_item_list:
            OrderItem.objects.create(user=request.user, productItem=basket_item.productItem,
                                     count=basket_item.count, order=order, price=basket_item.productItem.price)

        basket_item_list.delete()
        order_email_send.delay(order.id, request.user.id)

        return order

    @classmethod
    def createOrderInList(cls, request, data: list):
        """ Создание заказа из списка идентификаторов вариантов продукта"""

        ProductItemList = ProductItem.objects.filter(pk__in=data)
        BasketItemList = BasketItem.objects.bulk_create(
            [
                BasketItem(user=request.user, productItem=x) for x in ProductItemList
            ]
        )
        request.user.basket.add(*BasketItemList)
        cls.createOrderInBasket(request=request, basket_item_list=request.user.basket.all())

    @classmethod
    def getOrderList(cls, user):
        return default_order_optimize(user.user_order.all().order_by('-id'))
