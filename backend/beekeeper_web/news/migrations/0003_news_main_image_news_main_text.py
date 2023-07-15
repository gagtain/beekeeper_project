# Generated by Django 4.2.2 on 2023-07-14 12:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('news', '0002_alter_news_context'),
    ]

    operations = [
        migrations.AddField(
            model_name='news',
            name='main_image',
            field=models.ImageField(default='news/default.png', upload_to=''),
        ),
        migrations.AddField(
            model_name='news',
            name='main_text',
            field=models.TextField(blank=True),
        ),
    ]
