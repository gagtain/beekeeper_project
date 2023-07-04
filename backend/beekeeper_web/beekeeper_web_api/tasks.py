import sys

from celery import shared_task

from .services.Email import EmailOrder

sys.path.append('.')
from online_store.models import MainUser, Order

@shared_task()
def order_email_send(order_id, user_id):

    order = Order.objects.get(id=order_id)
    user = MainUser.objects.get(id=user_id)
    emailOrder = EmailOrder("smtp.gmail.com", 587)
    emailOrder.text_in_render_django_file({'order': order, 'host': 'http://shop.gagtain.online:8000/'})
    emailOrder.send_message(user.email)