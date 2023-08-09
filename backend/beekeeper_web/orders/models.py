from django.db import models
from djmoney.models.fields import MoneyField

from beekeeper_web_api.models import MainUser, ProductItem
from delivery.models import DeliveryTransaction
from payments.models import PaymentTransaction


# Create your models here.
class Order(models.Model):
    class StatusChoice(models.TextChoices):
        approved = "Одобрен"
        not_approved = "Не одобренный"
        closed = "Закрытый"

    user: MainUser = models.ForeignKey(MainUser, related_name='user_order', on_delete=models.CASCADE)
    amount = MoneyField(default=0, max_digits=14, decimal_places=2,
                        verbose_name="Сумма транзакции", default_currency='RUB')
    datetime = models.DateTimeField(auto_now_add=True, verbose_name="Время")
    payment = models.ForeignKey(PaymentTransaction,
                                related_name='order_payment_transaction',
                                on_delete=models.CASCADE, blank=True, null=True)
    delivery = models.ForeignKey(DeliveryTransaction,
                                 related_name='order_delivery_transaction',
                                 on_delete=models.CASCADE, blank=True, null=True)
    status = models.CharField(choices=StatusChoice.choices, default=StatusChoice.not_approved)

    description = models.CharField(max_length=300, default='')

    class Meta:
        verbose_name = u"Заказа"
        verbose_name_plural = u"Заказы"


class OrderItem(models.Model):
    user: MainUser = models.ForeignKey(MainUser, on_delete=models.CASCADE)
    order: Order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="product_list_transaction",
                                     default=21)
    productItem: ProductItem = models.ForeignKey(ProductItem, on_delete=models.CASCADE)
    count = models.PositiveIntegerField(default=1)
    price = MoneyField(default=0, max_digits=14, decimal_places=2,
                       verbose_name='Цена товара заказа', default_currency='RUB')

    def __str__(self):
        return f"{self.user.username} {self.productItem}"

    class Meta:
        verbose_name = u"Объект заказа"
        verbose_name_plural = u"Объекты заказов"
