# Generated by Django 4.2.2 on 2023-07-13 16:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('news', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='news',
            name='context',
            field=models.TextField(blank=True, verbose_name='Разметка новости'),
        ),
    ]
