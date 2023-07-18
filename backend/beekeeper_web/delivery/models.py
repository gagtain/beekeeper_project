from django.db import models

# Create your models here.



class DeliveryTransaction(models.Model):
    class DeliveryStatus(models.TextChoices):
        Under_review = "На проверке"
        Waiting_for_dispatch = "Ожидание доставки"
        Sent = "Отправлен"
        Waiting_at_the_pickup_point = "Ожидает в пункте выдачи"
        Accepted = "Принят"
    uuid = models.CharField(max_length=100)
    track_number = models.CharField(max_length=200, default='')
    status = models.CharField(choices=DeliveryStatus.choices, default='На проверке')
