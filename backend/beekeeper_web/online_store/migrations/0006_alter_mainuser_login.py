# Generated by Django 4.2.1 on 2023-05-26 11:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('online_store', '0005_alter_mainuser_options_alter_mainuser_managers_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='mainuser',
            name='login',
            field=models.CharField(max_length=50, unique=True),
        ),
    ]
