from django.contrib import admin
from .models import DeliveryTransaction, DeliveryState

# Register your models here.
admin.site.register(DeliveryTransaction)
admin.site.register(DeliveryState)
