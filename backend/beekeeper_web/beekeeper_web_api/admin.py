from django.contrib import admin

from news.models import News
from orders.models import OrderItem
from .models import MainUser, Product, Category, ImageProduct, ProductItem, \
    RatingProductReview, Type_weight, BasketItem, DimensionsProduct, BlockInfoSite, AddItem


# Register your models here.

class AddItemInline(admin.TabularInline):
    model = AddItem
    extra = 1

class ProductItemInline(admin.TabularInline):
    model = ProductItem
    extra = 1


class BlockInfoSiteAdmin(admin.ModelAdmin):
    inlines = (AddItemInline,)

class ProductAdmin(admin.ModelAdmin):
    inlines = (ProductItemInline,)


admin.site.register(DimensionsProduct)
admin.site.register(Product, ProductAdmin)
admin.site.register(BasketItem)
admin.site.register(ProductItem)
admin.site.register(Category)
admin.site.register(ImageProduct)
admin.site.register(OrderItem)
admin.site.register(Type_weight)
admin.site.register(RatingProductReview)
admin.site.register(News)
admin.site.register(BlockInfoSite, BlockInfoSiteAdmin)
admin.site.register(AddItem)
