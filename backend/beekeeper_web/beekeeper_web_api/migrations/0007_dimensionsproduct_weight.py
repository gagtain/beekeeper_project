# Generated by Django 4.2.2 on 2023-08-07 12:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('beekeeper_web_api', '0006_alter_productitem_weight'),
    ]

    operations = [
        migrations.AddField(
            model_name='dimensionsproduct',
            name='weight',
            field=models.FloatField(default=1, verbose_name='Вес'),
            preserve_default=False,
        ),
    ]
