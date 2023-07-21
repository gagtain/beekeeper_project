import sys
from rest_framework.exceptions import NotFound, ValidationError

from ..tasks import order_email_send

sys.path.append('.')
from ..models import Order, MainUser, BasketItem, OrderItem


class OrderServices():

    @classmethod
    def getLastOrder(cls, user_id: int) -> Order:
        LastOrder = Order.objects.filter(user__id=user_id).last()
        if LastOrder:
            return LastOrder
        else:
            raise NotFound("У пользователя нет заказов")

    @classmethod
    def createOrderInBasket(cls, request, BasketItemList: list[BasketItem], data: dict):
        """Создание заказа"""
        if BasketItemList.count() == 0:
            raise ValidationError(detail='Список товаров пуст')
        total_amount = 0

        for i in BasketItemList:
            print(i.productItem.product.price.amount)
            total_amount += i.count * i.productItem.product.price.amount  # добавить наценку за упаковку и скидки
        total_amount = float(total_amount) + float(request.data['delivery_price'])
        order = Order.objects.create(user=request.user, amount=total_amount)
        for basket_item in BasketItemList:
            OrderItem.objects.create(user=request.user, productItem=basket_item.productItem,
                                     count=basket_item.count, order=order)

        request.user.basket.clear()
        order_email_send.delay(order.id, request.user.id)

        return order

    @classmethod
    def compare_order_product_and_real_price(cls, user: MainUser, ):
        """Проверка стоимости товара в базе и стоимости товара у пользователя"""
        pass

    @classmethod
    def getOrderList(cls, user):
        return user.user_order.all().order_by('-id')
