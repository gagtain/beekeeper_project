from rest_framework import status
from rest_framework.response import Response
from yookassa.domain.notification import WebhookNotification

from payments.models import PaymentTransaction
from payments.services.Yookassa.Examination import examination_notifications


class YookassaNotifications:

    def payment_notifications(self, request):
        if examination_notifications(request):
            object_notification = WebhookNotification(request.data)
            payment_object: PaymentTransaction = PaymentTransaction.objects.get(
                id_payment=object_notification.object.id
            )
            payment_object.status = getattr(PaymentTransaction.StatusTransaction,
                                            object_notification.object.status)
            payment_object.save()
            return Response(status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Уведомление о платеже не было принято'})