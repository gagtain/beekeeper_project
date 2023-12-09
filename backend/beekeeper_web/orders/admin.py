from django.contrib import admin

from orders.models import Order


# Register your models here.

class OrderAdmin(admin.ModelAdmin):
    list_filter = ['status', 'payment__type', 'payment__status', 'delivery__delivery_type']


admin.site.register(Order, OrderAdmin)