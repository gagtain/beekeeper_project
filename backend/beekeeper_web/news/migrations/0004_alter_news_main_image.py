# Generated by Django 4.2.2 on 2023-07-14 14:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('news', '0003_news_main_image_news_main_text'),
    ]

    operations = [
        migrations.AlterField(
            model_name='news',
            name='main_image',
            field=models.ImageField(default='/media/news/default.png', upload_to=''),
        ),
    ]