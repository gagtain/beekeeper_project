from django.db import models


# Create your models here.


class PaymentTransaction(models.Model):
    class StatusTransaction(models.TextChoices):
        pending = 'pending'
        succeeded = 'succeeded'
        canceled = 'canceled'
        waiting_for_capture = 'waiting_for_capture'

    class PaymentType(models.TextChoices):
        online = "Онлайн оплата"
        offline = "Личная оплата"


    id_payment = models.CharField(max_length=400)
    status = models.CharField(choices=StatusTransaction.choices)
    type = models.CharField(choices=PaymentType.choices, default=PaymentType.online)
    url = models.URLField()

    class Meta:
        verbose_name = u"Платежная транзакция"
        verbose_name_plural = u"Платежные транзакции"
