# Generated by Django 4.2.1 on 2023-05-27 17:37

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('online_store', '0015_userbalancechange_amount_currency_and_more'),
    ]

    operations = [
        migrations.AlterModelManagers(
            name='mainuser',
            managers=[
            ],
        ),
        migrations.RenameField(
            model_name='mainuser',
            old_name='username',
            new_name='login',
        ),
        migrations.RemoveField(
            model_name='mainuser',
            name='is_active',
        ),
        migrations.RemoveField(
            model_name='mainuser',
            name='is_staff',
        ),
    ]
