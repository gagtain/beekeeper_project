from django.db import models

from user.validators import number_validator


# Create your models here.


class DeliveryTransaction(models.Model):
    class DeliveryStatus(models.TextChoices):
        Under_review = "На проверке"
        Waiting_for_dispatch = "Ожидание доставки"
        Sent = "Отправлен"
        Waiting_at_the_pickup_point = "Ожидает в пункте выдачи"
        Accepted = "Принят"
        closed = "Отменен"

    class DeliveryMethod(models.TextChoices):
        Courier = "Курьер"
        To_pickup_point = "До пункта выдачи"

    uuid = models.CharField(max_length=100, blank=True)
    track_number = models.CharField(max_length=200, default='', blank=True)
    status = models.CharField(choices=DeliveryStatus.choices, default='На проверке')
    delivery_method = models.CharField(choices=DeliveryMethod.choices, default=DeliveryMethod.To_pickup_point)
    where = models.CharField(max_length=200, default='Уварово ПМЗ UVA01')
    price = models.FloatField(verbose_name="Цена доставки", default=0)
    number = models.CharField(max_length=11, validators=[number_validator],
                              verbose_name="Номер телефона заказчика", default="")

    class Meta:
        verbose_name = u"Транзакция доставки"
        verbose_name_plural = u"Транзакции доставок"
