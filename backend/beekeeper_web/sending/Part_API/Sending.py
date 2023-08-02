from django.http import HttpRequest
from rest_framework.response import Response

from user.models import MainUser


class SendingAdd:

    def add_user_sending(self, request):
        user: MainUser = request.user
        user.is_sending = True
        user.save()
        data = {
            'type': 'success'
        }
        return Response(data=data, status=200)


class SendingRemove:

    def remove_user_sending(self, request):
        user: MainUser = request.user
        user.is_sending = False
        user.save()
        data = {
            'type': 'success'
        }
        return Response(data=data, status=200)
