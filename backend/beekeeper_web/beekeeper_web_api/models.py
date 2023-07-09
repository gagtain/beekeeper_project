import os
from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import AbstractUser, PermissionsMixin, UserManager
from django.db import models
from django.db.models.manager import BaseManager
from django.utils import timezone
from djmoney.models.fields import MoneyField
from django.utils.translation import gettext_lazy as _

from payments.models import PaymentTransaction


# Create your models here.


class MainUser(AbstractBaseUser, PermissionsMixin):
    """"Модель пользователя"""
    # card = необходимо реализовать оплату, она будет на API
    username = models.CharField(max_length=50, unique=True, verbose_name="логин")
    FIO = models.CharField(max_length=100, blank=False)
    email = models.EmailField(blank=False, default='asd@asd.ru')
    image = models.ImageField(upload_to="images/%Y/%m/%d/", verbose_name="Изображение пользователя",
                              blank=True, default="images/ds.png")
    basket = models.ManyToManyField(through='BasketItem', to='ProductItem', related_name="basket")
    favorite_product = models.ManyToManyField(through='FavoriteItem', to='ProductItem', related_name='favorite_product')
    USERNAME_FIELD = 'username'
    is_staff = models.BooleanField(
        _("staff status"),
        default=False,
        help_text=_("Designates whether the user can log into this admin site."),
    )
    is_active = models.BooleanField(
        _("active"),
        default=True,
        help_text=_(
            "Designates whether this user should be treated as active. "
            "Unselect this instead of deleting accounts."
        ),
    )
    date_joined = models.DateTimeField(_("date joined"), default=timezone.now)

    objects = UserManager()

    def __str__(self):
        return self.username



class Type_packaging(models.Model):
    name = models.CharField(max_length=100, verbose_name="Название типа упаковки")

    def __str__(self):
        return self.name


class Category(models.Model):
    name = models.CharField(max_length=100, verbose_name="Название категории")

    def __str__(self):
        return self.name


def get_galery_item_url(instance, filename):
    return os.path.join(instance.product.name, 'galery', filename)


class ImageProduct(models.Model):
    photo = models.ImageField(upload_to=get_galery_item_url)
    product = models.ForeignKey('Product', on_delete=models.CASCADE, related_name="ImageProductList",
                                verbose_name="Продукт")


class Type_weight(models.Model):
    weight = models.FloatField(verbose_name="Вес в граммах")

    def __str__(self):
        return str(self.weight)


class Product(models.Model):
    """"Модель продукта"""
    name = models.CharField(max_length=100, blank=False, verbose_name="Название продукта")
    description = models.CharField(max_length=200, blank=True, verbose_name="Описание")
    image = models.ImageField(upload_to="images/%Y/%m/%d/", verbose_name="Изображение товара", blank=False,
                              default="admin")
    price = MoneyField(max_digits=14, decimal_places=2, default_currency='RUB', verbose_name="Цена")
    count_purchase = models.IntegerField(default=0, verbose_name="кол-во покупок")
    category = models.ManyToManyField(Category, related_name='category_list', blank=True)
    list_weight = models.ManyToManyField(Type_weight, null=True, related_name='list_weight')
    type_packaging = models.ManyToManyField(Type_packaging, related_name='type_packaging_list', blank=True)
    objects = models.Manager()

    def __str__(self):
        return self.name

class ProductItem(models.Model):
    """Объект продукта с определенными параметрами"""
    product: Product = models.ForeignKey('Product', on_delete=models.CASCADE, related_name='productItemList')
    weight = models.ForeignKey('Type_weight', on_delete=models.CASCADE)  # ожидание в ТЗ информации о кастомном весе.
    type_packaging = models.ForeignKey('Type_packaging', on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.product.name} {self.weight} {self.type_packaging}"


class BasketItem(models.Model):
    """Связь корзины пользователя с объектом продукта с определенными параметрами"""
    user: MainUser = models.ForeignKey(MainUser, on_delete=models.CASCADE)
    productItem: ProductItem = models.ForeignKey('ProductItem', on_delete=models.CASCADE, default=1)
    count = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.user.username} {self.productItem}"


class FavoriteItem(models.Model):
    """Связь избранных пользователя с объектом продукта с определенными параметрами"""
    user: MainUser = models.ForeignKey(MainUser, on_delete=models.CASCADE)
    productItem = models.ForeignKey('ProductItem', on_delete=models.CASCADE, default=1)

    def __str__(self):
        return f"{self.user.username} {self.productItem}"




class Order(models.Model):
    user: MainUser = models.ForeignKey(MainUser, related_name='user_order', on_delete=models.CASCADE)
    amount = MoneyField(default=0, max_digits=14, decimal_places=2,
                        verbose_name="Сумма транзакции", default_currency='RUB')
    datetime = models.DateTimeField(auto_now_add=True, verbose_name="Время")
    order_address = models.CharField(max_length=400, default="")
    order_index = models.CharField(max_length=100, default="")
    payment = models.ForeignKey(PaymentTransaction,
                                related_name='order_payment_transaction',
                                on_delete=models.CASCADE, blank=True, null=True)

class OrderItem(models.Model):
    user: MainUser = models.ForeignKey(MainUser, on_delete=models.CASCADE)
    order: Order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="product_list_transaction",
                                     default=21)
    productItem: ProductItem = models.ForeignKey('ProductItem', on_delete=models.CASCADE)
    count = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.user.username} {self.productItem}"


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
