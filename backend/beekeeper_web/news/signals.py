from django.db.models.signals import post_save
from django.dispatch import receiver

from news.Services.notify import create_default_news_text
from news.models import News
from notify.services.notify_services import CreateNotifyEnum


@receiver(post_save, sender=News)
def notify_news_create(created, instance: News, **kwargs):
    if created:
        func = CreateNotifyEnum.all_news
        text = create_default_news_text(news=instance)
        func(news=instance, text=text)
