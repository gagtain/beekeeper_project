# Generated by Django 4.2.2 on 2023-12-19 07:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('beekeeper_web_api', '0015_blockinfosite_title'),
    ]

    operations = [
        migrations.AddField(
            model_name='blockinfosite',
            name='email',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='blockinfosite',
            name='number',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
    ]