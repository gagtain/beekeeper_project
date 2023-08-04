from django.db import models
from django_celery_beat.models import PeriodicTask

from sending.services.specific_sending import create_specific_sending
from user.models import MainUser


# Create your models here.

class EmailSending(models.Model):
    """ Модель отвечающая за почту на которую отправляется рассылка """
    email = models.EmailField()
    user = models.OneToOneField(MainUser, on_delete=models.CASCADE, related_name='user_sending')





class SpecificSending(models.Model):
    """Класс специальной рассылки"""
    class MessageTypeChoices(models.TextChoices):
        product = "О новых продуктах / product"
        news = "О новостях / news"

    name = models.CharField(max_length=100, default='', verbose_name="Название рассылки")
    message = models.CharField(choices=MessageTypeChoices.choices, default=MessageTypeChoices.product)
    data = models.DateTimeField(verbose_name="Время начала рассылки", null=True)
    periods = models.BooleanField(verbose_name="Повторять задачу?", default=False)
    task_id = models.TextField(default='', blank=True)

    def save(
            self, *args, **kwargs
    ):
        created = not self.id
        instance = super().save(*args, **kwargs)
        if created:
            self.task_id = create_specific_sending(self)
            self.save()
        return instance
