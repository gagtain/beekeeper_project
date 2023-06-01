from django.contrib import admin

from .models import MainUser, Product, UserBalanceChange

# Register your models here.

admin.site.register(MainUser)
admin.site.register(Product)
admin.site.register(UserBalanceChange)