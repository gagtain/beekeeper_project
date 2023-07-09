import enum


from payments.services.Yookassa.Payments import PaymentsYookassaServices


class PaymentService(enum.Enum):
    """Данный класс необходим для получения необходимой модели заказа"""
    yookassa = PaymentsYookassaServices

