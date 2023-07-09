from django.db import models



# Create your models here.


class PaymentTransaction(models.Model):
    class StatusTransaction(models.TextChoices):
        pending = 'pending'
        succeeded = 'succeeded'
        canceled = 'canceled'
    id_payment = models.CharField(max_length=400)
    status = models.CharField(choices=StatusTransaction.choices)