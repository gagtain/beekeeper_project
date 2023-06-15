from django.contrib import admin

from .models import MainUser, Product, UserBalanceChange, Category, Type_packaging, ImageProduct, Type_weight, BasketItem

# Register your models here.
class BasketItemInline(admin.TabularInline):
    model = BasketItem
    extra = 1


class AccountAdmin(admin.ModelAdmin):
    inlines = (BasketItemInline,)




admin.site.register(MainUser, AccountAdmin)
admin.site.register(Product)
admin.site.register(BasketItem)
admin.site.register(UserBalanceChange)
admin.site.register(Category)
admin.site.register(ImageProduct)
admin.site.register(Type_packaging)
admin.site.register(Type_weight)