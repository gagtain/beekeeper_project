# Generated by Django 4.2.2 on 2023-07-31 14:27

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('beekeeper_web_api', '0003_dimensionsproduct_productitem_dimensions'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='dimensionsproduct',
            options={'verbose_name': 'Габариты', 'verbose_name_plural': 'Габариты'},
        ),
    ]
