import os
from django.db import models
from djmoney.models.fields import MoneyField

from user.models import MainUser


# Create your models here.


class Category(models.Model):
    name = models.CharField(max_length=100, verbose_name="Название категории")

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = u"Категория продукта"
        verbose_name_plural = u"Категории товаров"


class ImageProduct(models.Model):

    def get_galery_item_url(instance, filename):
        return os.path.join(instance.product.name, 'galery', filename)

    photo = models.ImageField(upload_to=get_galery_item_url)
    product = models.ForeignKey('Product', on_delete=models.CASCADE, related_name="ImageProductList",
                                verbose_name="Продукт")

    class Meta:
        verbose_name = u"Дополнительное изображение продукта"
        verbose_name_plural = u"Дополнительные изображения продуктов"


class Type_weight(models.Model):
    weight = models.FloatField(verbose_name="Вес в граммах")

    def __str__(self):
        return str(self.weight)

    class Meta:
        verbose_name = u"Тип веса товара"
        verbose_name_plural = u"Типы веса товара"


class DimensionsProduct(models.Model):
    length = models.FloatField(verbose_name='Длина')
    width = models.FloatField(verbose_name='Ширина')
    height = models.FloatField(verbose_name='Высота')
    weight = models.FloatField(verbose_name='Вес')

    class Meta:
        verbose_name = u"Габариты"
        verbose_name_plural = u"Габариты"


class Product(models.Model):
    """"Модель продукта"""
    name = models.CharField(max_length=100, blank=False, verbose_name="Название продукта")
    description = models.CharField(max_length=200, blank=True, verbose_name="Описание")
    image = models.ImageField(upload_to="images/%Y/%m/%d/", verbose_name="Изображение товара", blank=False,
                              default="admin")
    count_purchase = models.IntegerField(default=0, verbose_name="кол-во покупок")
    category = models.ManyToManyField(Category, related_name='category_list', blank=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = u"Продукт"
        verbose_name_plural = u"Продукты"


class ProductItem(models.Model):
    """Объект продукта с определенными параметрами"""
    product: Product = models.ForeignKey('Product', on_delete=models.CASCADE, related_name='productItemList')
    weight = models.ForeignKey('Type_weight', on_delete=models.CASCADE, blank=True, null=True)
    price = MoneyField(default=0, max_digits=14, decimal_places=2,
                       verbose_name="Цена варианта", default_currency='RUB')
    dimensions = models.ForeignKey(DimensionsProduct, verbose_name='Габариты', on_delete=models.CASCADE, null=True)

    def __str__(self):
        return f"{self.product.name} {self.weight}"

    class Meta:
        verbose_name = u"Вариант продукта"
        verbose_name_plural = u"Варианты продуктов"


class RatingProductReview(models.Model):
    class Suit(models.IntegerChoices):
        AWESOME = 5
        GOOD = 4
        satisfactorily = 3
        BAD = 2
        VERY_BAD = 1

    rating = models.IntegerField(choices=Suit.choices)
    user: MainUser = models.ForeignKey(MainUser, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='rating_product')

    class Meta:
        verbose_name = u"Объект рейтинга продукта"
        verbose_name_plural = u"Объекты рейтинга продукта"


class BasketItem(models.Model):
    """Связь корзины пользователя с объектом продукта с определенными параметрами"""
    user: MainUser = models.ForeignKey(MainUser, on_delete=models.CASCADE, related_name='basket')
    productItem = models.ForeignKey(ProductItem, on_delete=models.CASCADE, default=1)
    count = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.user.username} {self.productItem}"

    class Meta:
        verbose_name = u"Объект корзины"
        verbose_name_plural = u"Объекты корзины"


class FavoriteItem(models.Model):
    """Связь избранных пользователя с объектом продукта с определенными параметрами"""
    user: MainUser = models.ForeignKey(MainUser, on_delete=models.CASCADE, related_name='favorite_product')
    productItem = models.ForeignKey('ProductItem', on_delete=models.CASCADE, default=1)

    def __str__(self):
        return f"{self.user.username} {self.productItem}"

    class Meta:
        verbose_name = u"Объект избранного"
        verbose_name_plural = u"Объекты избранного"
