import decimal
import sys

from django.db.models import QuerySet
from rest_framework.exceptions import NotFound, ValidationError

from orders.models import Order, OrderItem
from ..tasks import order_email_send

sys.path.append('.')
from ..models import MainUser, BasketItem


class OrderServices():

    @classmethod
    def getLastOrder(cls, user_id: int) -> Order:
        LastOrder = Order.objects.filter(user__id=user_id).last()
        if LastOrder:
            return LastOrder
        else:
            raise NotFound("У пользователя нет заказов")

    @classmethod
    def createOrderInBasket(cls, request, basket_item_list: QuerySet[BasketItem], data: dict):
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
        # order_email_send.delay(order.id, request.user.id)

        return order

    @classmethod
    def compare_order_product_and_real_price(cls, user: MainUser, ):
        """Проверка стоимости товара в базе и стоимости товара у пользователя"""
        pass

    @classmethod
    def getOrderList(cls, user):
        return user.user_order.all().order_by('-id')
