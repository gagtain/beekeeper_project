import enum


from payments.services.Yookassa.Payments import PaymentsYookassaServices
from payments.services.offline.Payments import PaymentsOfflineServices


class PaymentService(enum.Enum):
    """Данный класс необходим для получения необходимой модели заказа"""
    yookassa = PaymentsYookassaServices
    offline = PaymentsOfflineServices

