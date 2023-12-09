# Generated by Django 4.2.2 on 2023-12-09 08:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('payments', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='paymenttransaction',
            name='type',
            field=models.CharField(choices=[('Онлайн оплата', 'Online'), ('Личная оплата', 'Offline')], default='Онлайн оплата'),
        ),
        migrations.AlterField(
            model_name='paymenttransaction',
            name='url',
            field=models.URLField(),
        ),
    ]