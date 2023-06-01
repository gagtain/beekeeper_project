# Generated by Django 4.2.1 on 2023-05-27 20:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('online_store', '0016_alter_mainuser_managers_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='mainuser',
            name='basket',
            field=models.ManyToManyField(related_name='basket', to='online_store.product'),
        ),
    ]
