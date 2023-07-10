from django.db import models

# Create your models here.


class DeliveryTransaction(models.Model):
    uuid = models.CharField(max_length=100)
