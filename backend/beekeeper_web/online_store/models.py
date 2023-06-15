import os
from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import AbstractUser, PermissionsMixin, UserManager
from django.db import models
from django.db.models.manager import BaseManager
from django.utils import timezone
from djmoney.models.fields import MoneyField
from django.utils.translation import gettext_lazy as _


# Create your models here.


class MainUser(AbstractBaseUser, PermissionsMixin):
    """"Модель пользователя"""
    # card = необходимо реализовать оплату, она будет на API
    username = models.CharField(max_length=50, unique=True, verbose_name="логин")
    FIO = models.CharField(max_length=100, blank=False)
    email = models.EmailField(_("email address"), blank=True)
    image = models.ImageField(upload_to="images/%Y/%m/%d/", verbose_name="Изображение пользователя",
                              blank=True, default="images/ds.png")
    balance = MoneyField(default=0, max_digits=14, decimal_places=2, default_currency='RUB',
                         verbose_name="Сумма баланса")
    basket = models.ManyToManyField(through='BasketItem', to='Product', related_name="basket")
    favorite_product = models.ManyToManyField('Product', related_name='favorite_product')
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

class BasketItem(models.Model):
    user: MainUser = models.ForeignKey(MainUser, on_delete=models.CASCADE)
    product = models.ForeignKey('Product', on_delete=models.CASCADE)
    weight = models.ForeignKey('Type_weight', on_delete=models.CASCADE) # ожидание в ТЗ информации о кастомном весе.
    type_packaging = models.ForeignKey('Type_packaging', on_delete=models.CASCADE)
    count = models.PositiveIntegerField(default=1)


    def __str__(self):
        return f"{self.user.username} {self.product.name} {self.weight.weight} {self.type_packaging.name}"



class UserBalanceChange(models.Model):
    user = models.ForeignKey(MainUser, related_name='balance_changes', on_delete=models.CASCADE)
    amount = MoneyField(default=0, max_digits=14, decimal_places=2,
                        verbose_name="Сумма транзакции", default_currency='RUB')
    tovar_list = models.ManyToManyField('Product', verbose_name="Товары заказа",
                                        related_name="product_list_transaction")
    datetime = models.DateTimeField(default=timezone.now, verbose_name="Время")

    def save(self, *args, **kwargs):
        self.user.balance += self.amount
        self.user.save()
        super().save(*args, **kwargs)


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
