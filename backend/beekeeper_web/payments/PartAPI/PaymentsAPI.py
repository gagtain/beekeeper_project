from drf_yasg.utils import swagger_auto_schema
from rest_framework.response import Response
from rest_framework.views import APIView

from payments.Enum_type.Order_model import OrderModel
from payments.Enum_type.Payment_System import PaymentService
from payments.services.Abstract.AbstractPaymentServise import AbstractPaymentService


class CreatePaymentsAPI(APIView):

    @swagger_auto_schema(tags=['payment'])
    def create_payments(self, request):
        """Создание транзакции"""
        """
        data:
            сумма
            платежная система yookassa
            у кого купить (online_store, forum)
            номер заказа
        """
        try:
            payment_service_class: AbstractPaymentService = getattr(PaymentService,
                                                                    request.data['payment_service']).value
        except AttributeError:
            return Response({'error': 'выбранной платежной системы не существует'})
        try:
            order_model = getattr(OrderModel, request.data['order_service']).value
        except AttributeError:
            return Response({'error': 'выбранной заказной системы не существует'})
        Order = order_model.objects.get(id=request.data['order_id'])

        initial_data = payment_service_class.get_initial_data(request.data, Order)
        payment = payment_service_class.create_payment(initial_data)
        payment_service_class.create_model_payment(payment, Order)

        return Response({'payment_url': payment.confirmation.confirmation_url})
