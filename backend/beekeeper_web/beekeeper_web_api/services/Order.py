import sys

from django.template.loader import render_to_string
from rest_framework.exceptions import NotFound, ValidationError

from celery_app import debug_task
from .Email import EmailOrder

sys.path.append('.')
from online_store.models import Order, MainUser, BasketItem, OrderItem


class OrderServices():

    @classmethod
    def getLastOrder(cls, user_id: int) -> Order:
        LastOrder = Order.objects.filter(user__id=user_id).last()
        if LastOrder:
            return LastOrder
        else:
            raise NotFound("У пользователя нет заказов")

    @classmethod
    def createOrder(cls, user: MainUser, BasketItemList: list[BasketItem]):
        """Создание заказа"""
        if BasketItemList.count() == 0:
            raise ValidationError(detail='Список товаров пуст')
        total_amount = 0
        for i in BasketItemList:
            total_amount += i.count * (i.productItem.product.price ) # добавить наценку за упаковку и скидки
        order = Order.objects.create(user=user, amount=total_amount)
        for basket_item in BasketItemList:
            OrderItem.objects.create(user=user, productItem=basket_item.productItem,
                                     count=basket_item.count, order=order)

        user.basket.clear()
        debug_task.delay(order.id, user.id)

        return order

    @classmethod
    def getOrderList(cls, user):
        return user.user_order.all()
