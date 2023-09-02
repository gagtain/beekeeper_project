from django.db.models.signals import post_save
from django.dispatch import receiver
from orders.models import Order
from notify.services.notify_services import CreateNotifyEnum


@receiver(post_save, sender=Order)
def notify_order_create(created, instance: Order, update_fields: frozenset | None, **kwargs):
    if created and instance.status != Order.StatusChoice.checkout:
        func = CreateNotifyEnum.user_order
        func(order=instance, text='Ваш заказ на проверке')
    elif update_fields is not None:
        if 'status' in update_fields:
            func = CreateNotifyEnum.user_order_status
            func(order=instance)
