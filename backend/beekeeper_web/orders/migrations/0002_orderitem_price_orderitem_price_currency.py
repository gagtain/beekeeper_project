# Generated by Django 4.2.2 on 2023-07-27 13:50

from decimal import Decimal
from django.db import migrations
import djmoney.models.fields


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='orderitem',
            name='price',
            field=djmoney.models.fields.MoneyField(decimal_places=2, default=Decimal('0'), default_currency='RUB', max_digits=14, verbose_name='Цена товара заказа'),
        ),
        migrations.AddField(
            model_name='orderitem',
            name='price_currency',
            field=djmoney.models.fields.CurrencyField(choices=[('EUR', 'Euro'), ('RUB', 'Russian Ruble'), ('USD', 'US Dollar')], default='RUB', editable=False, max_length=3),
        ),
    ]