# Generated by Django 4.2.2 on 2023-07-14 14:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('news', '0004_alter_news_main_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='news',
            name='main_image',
            field=models.ImageField(default='news/default.png', upload_to=''),
        ),
    ]