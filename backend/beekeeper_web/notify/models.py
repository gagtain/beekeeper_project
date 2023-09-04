from django.db import models

from delivery.models import DeliveryTransaction
from user.models import MainUser


# Create your models here.


class Notify(models.Model):
    class NotifyChoice(models.TextChoices):
        news = "Новости"
        product = "Продукты"
        delivery = "Доставка"
        order = "Заказы"
    type = models.CharField(choices=NotifyChoice.choices)
    text = models.CharField(max_length=120)
    is_viewed = models.ManyToManyField(MainUser, related_name="is_viewed_notify", blank=True)
    users = models.ForeignKey(MainUser, related_name="notify_list", on_delete=models.CASCADE, blank=True, null=True)
    all = models.BooleanField(default=False, verbose_name="Отправлять всем")
    time = models.DateTimeField(auto_now=True)
    order = models.ForeignKey('orders.Order', related_name='notify_list', on_delete=models.CASCADE,
                              null=True, blank=True)
    delivery = models.ForeignKey(DeliveryTransaction, related_name='notify_list', on_delete=models.CASCADE,
                                 null=True, blank=True)
