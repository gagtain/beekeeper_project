from django.db import models

from user.models import MainUser


# Create your models here.


class Notify(models.Model):
    class NotifyChoice(models.TextChoices):
        news = "Новости"
        product = "Продукты"
        order = "Заказы"
    type = models.CharField(choices=NotifyChoice.choices)
    text = models.CharField(max_length=120)
    is_viewed = models.ManyToManyField(MainUser, related_name="is_viewed_notify", blank=True)
    users = models.ForeignKey(MainUser, related_name="notify_list", on_delete=models.CASCADE, blank=True, null=True)
    all = models.BooleanField(default=False, verbose_name="Отправлять всем")
