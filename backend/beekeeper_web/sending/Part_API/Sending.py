from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpRequest
from rest_framework.response import Response

from sending.serializers import EmailSendingSerializer
from user.models import MainUser


class SendingAdd:

    def add_user_sending(self, request):
        user: MainUser = MainUser.objects.get(id=1)
        serializer = EmailSendingSerializer(data={
            'user': user.id,
            'email': request.data.get('email')
        })
        serializer.is_valid(raise_exception=True)
        serializer.create(serializer.validated_data)
        user.is_sending = True
        user.save()
        data = {
            'type': 'success'
        }
        return Response(data=data, status=200)


class SendingRemove:

    def remove_user_sending(self, request):
        user: MainUser = MainUser.objects.get(id=1)
        try:
            user.user_sending.delete()
            user.is_sending = False
            user.save()
            data = {
                'type': 'success'
            }
        except ObjectDoesNotExist:
            data = {
                'error': 'Данный пользователь не подписан на рассылку'
            }
        return Response(data=data, status=200)
