import uuid

from yookassa import Payment

from payments import shemas
from payments.models import PaymentTransaction
from payments.services.Abstract.AbstractPaymentServise import AbstractPaymentService


class PaymentsYookassaServices(AbstractPaymentService):

    @classmethod
    def create_payment(cls, data: shemas.PaymentsCreate):
        payment: shemas.PaymentsResponseCreate = Payment.create(data.to_dict(), uuid.uuid4())
        return payment

    @classmethod
    def create_model_payment(cls, data: shemas.PaymentsResponseCreate, order):
        payment = PaymentTransaction.objects.create(id_payment=data.id, status=data.status)
        order.payment = payment
        order.save()

    @classmethod
    def get_initial_data(cls, data):
        initial_data = shemas.PaymentsCreate(
            amount=shemas.PaymentsAmount(
                value=data['value'],
                currency=data['currency']
            ),
            capture=True,
            confirmation=shemas.PaymentsConfirmation(
                return_url='https:vk.com',
                type='redirect'
            ),
            description=f'Заказ №{data["order_id"]}'
        )
        return initial_data
