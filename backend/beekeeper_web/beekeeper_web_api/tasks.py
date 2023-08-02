import sys

from celery import shared_task

from orders.models import Order
from .services.Email import EmailOrder

sys.path.append('.')
from .models import MainUser


@shared_task()
def order_email_send(order_id, user_id):
    order = Order.objects.get(id=order_id)
    user = MainUser.objects.get(id=user_id)
    emailOrder = EmailOrder("smtp.gmail.com", 587)
    emailOrder.text_in_render_django_file({'order': order, 'host': 'https://owa.gagtain.ru/'})
    emailOrder.send_message(user.email)
