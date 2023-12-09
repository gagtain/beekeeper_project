import datetime
import uuid

from payments import shemas
from payments.models import PaymentTransaction
from payments.services.Abstract.AbstractPaymentServise import AbstractPaymentService


class PaymentsOfflineServices(AbstractPaymentService):

    @classmethod
    def create_payment(cls, data: shemas.PaymentsCreate):
        payment = shemas.PaymentsResponseCreate(id=str(uuid.uuid4()),
                                                status=PaymentTransaction.StatusTransaction.pending,
                                                paid=False,
                                                amount=data.amount,
                                                confirmation=shemas.PaymentsResponseConfirmation(
                                                    confirmation_url="/"
                                                ),
                                                created_at=datetime.datetime.now().strftime("%Y-%m-%d"),
                                                capture=False,
                                                description=data.description)
        return payment

    @classmethod
    def create_model_payment(cls, data: shemas.PaymentsResponseCreate, order):
        payment = PaymentTransaction.objects.create(id_payment=data.id,
                                                    status=data.status,
                                                    url=data.confirmation.confirmation_url,
                                                    type=PaymentTransaction.PaymentType.offline)
        order.payment = payment
        order.save()

    @classmethod
    def get_initial_data(cls, data, order):
        initial_data = shemas.PaymentsCreate(
            amount=shemas.PaymentsAmount(
                value=str(order.amount.amount),
                currency=data['currency']
            ),
            capture=True,
            confirmation=shemas.PaymentsConfirmation(
                return_url='https://pchel-artel.ru/orders',
                type='redirect'
            ),
            description=f'Заказ №{data["order_id"]}'
        )
        return initial_data
