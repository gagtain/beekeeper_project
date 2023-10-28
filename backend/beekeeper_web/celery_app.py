import os
import time
from user.tasks import sending_user_code_auth_task, sending_user_code_in_cache_task, \
    sending_user_code_telegram_in_cache_task

from celery import Celery
from celery.schedules import crontab
from django.conf import settings


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'beekeeper_web.settings')

app = Celery('beekeeper_web')
app.config_from_object('django.conf:settings')
app.conf.broker_url = settings.CELERY_BROKER_URL
app.autodiscover_tasks()

@app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    # Calls test('hello') every 10 seconds.
    sender.add_periodic_task(10.0, sending_user_code_in_cache_task.s())
    sender.add_periodic_task(10.0, sending_user_code_telegram_in_cache_task.s())

