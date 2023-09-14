from django.db import models

from user.models import MainUser


# Create your models here.


class UserTelegram(models.Model):
    user = models.OneToOneField(MainUser, related_name="telegram", on_delete=models.CASCADE)
    telegram_id = models.CharField(max_length=150)

