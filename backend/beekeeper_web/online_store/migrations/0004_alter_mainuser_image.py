# Generated by Django 4.2.1 on 2023-05-26 07:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('online_store', '0003_product_count_purchase'),
    ]

    operations = [
        migrations.AlterField(
            model_name='mainuser',
            name='image',
            field=models.ImageField(blank=True, upload_to='images/%Y/%m/%d/', verbose_name='Изображение пользователя'),
        ),
    ]
