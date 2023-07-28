
import sys

from celery import shared_task

from orders.models import Order
from payments.models import PaymentTransaction

sys.path.append('.')
from .models import MainUser

@shared_task()
def check_order_payment(order_id):

    order = Order.objects.get(id=order_id)
    if not order.payment.status == PaymentTransaction.StatusTransaction.succeeded:
        order.status = Order.StatusChoice.closed
        order.description = 'Не уплачен вовремя'
        order.save()
