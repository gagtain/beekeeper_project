import os
import time

from celery import Celery
from django.conf import settings


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'beekeeper_web.settings')

app = Celery('beekeeper_web')
app.config_from_object('django.conf:settings')
app.conf.broker_url = settings.CELERY_BROKER_URL
app.autodiscover_tasks()

@app.task()
def debug_task(order_id, user_id):
    from online_store.models import Order, MainUser
    from beekeeper_web_api.services.Email import EmailOrder

    order = Order.objects.get(id=order_id)
    user = MainUser.objects.get(id=user_id)
    emailOrder = EmailOrder("smtp.gmail.com", 587)
    emailOrder.text_in_render_django_file({'order': order, 'host': 'http://shop.gagtain.online:8000/'})
    emailOrder.send_message(user.email)