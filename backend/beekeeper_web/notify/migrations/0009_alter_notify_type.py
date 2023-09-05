# Generated by Django 4.2.2 on 2023-09-05 17:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('notify', '0008_notify_order_alter_notify_delivery'),
    ]

    operations = [
        migrations.AlterField(
            model_name='notify',
            name='type',
            field=models.CharField(choices=[('Новости', 'News'), ('Продукты', 'Product'), ('Доставка', 'Delivery'), ('Заказы', 'Order'), ('Общий', 'General')], default='Общий'),
        ),
    ]
