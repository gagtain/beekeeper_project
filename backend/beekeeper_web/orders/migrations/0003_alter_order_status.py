# Generated by Django 4.2.2 on 2023-08-25 16:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0002_orderitem_price_orderitem_price_currency'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='status',
            field=models.CharField(choices=[('Закрытый', 'Closed'), ('Не подтвержденный', 'Checkout'), ('Не одобренный', 'Not Approved'), ('Одобрен', 'Approved')], default='Не одобренный'),
        ),
    ]
