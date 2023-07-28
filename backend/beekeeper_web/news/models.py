from django.db import models

from beekeeper_web import settings


# Create your models here.

class News(models.Model):
    title = models.CharField(max_length=100, verbose_name='Название')
    main_image = models.ImageField(default='news/default.png')
    main_text = models.TextField(blank=True)
    context = models.TextField(verbose_name='Разметка новости', blank=True)

    class Meta:
        verbose_name = u"Новость"
        verbose_name_plural = u"Новости"
