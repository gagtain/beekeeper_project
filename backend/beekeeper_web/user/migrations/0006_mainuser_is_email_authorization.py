# Generated by Django 4.2.2 on 2023-08-25 16:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0005_alter_mainuser_number'),
    ]

    operations = [
        migrations.AddField(
            model_name='mainuser',
            name='is_email_authorization',
            field=models.BooleanField(default=False),
        ),
    ]