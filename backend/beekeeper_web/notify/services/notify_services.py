import enum
from functools import partial

from news.models import News
from notify.models import Notify
from orders.models import Order


def create_all_news_notify(news: News, text=None):
    return Notify.objects.create(type=Notify.NotifyChoice.news, all=True, text=text)



def create_user_order_notify(order: Order, text=None):
    return Notify.objects.create(type=Notify.NotifyChoice.order, users=order.user, text=text)

def create_user_order_status_notify(order: Order):
    status_answer = {
        Order.StatusChoice.closed: 'Ваш заказ отменен',
        Order.StatusChoice.approved: 'Ваш заказ подтвержден',
        Order.StatusChoice.not_approved: 'Ваш заказ на проверке'
    }
    return Notify.objects.create(type=Notify.NotifyChoice.order,
                                 users=order.user,
                                 text=status_answer[order.status])



class CreateNotifyEnum(enum.Enum):
    all_news = partial(create_all_news_notify)
    all_product = ''
    user_order = partial(create_user_order_notify)
    user_order_status = partial(create_user_order_status_notify)

    def __call__(self, *args, **kwargs):
        self.value(*args, **kwargs)