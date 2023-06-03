from django.contrib import admin

from .models import MainUser, Product, UserBalanceChange, Category, Type_packaging

# Register your models here.

admin.site.register(MainUser)
admin.site.register(Product)
admin.site.register(UserBalanceChange)
admin.site.register(Category)
admin.site.register(Type_packaging)