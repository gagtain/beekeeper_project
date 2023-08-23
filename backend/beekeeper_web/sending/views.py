from django.shortcuts import render
from rest_framework.viewsets import ViewSet

from sending.Part_API.Sending import SendingAdd, SendingRemove
from user.jwt_token.auth import CustomAuthentication


# Create your views here.

class SendingAPI(ViewSet, SendingAdd, SendingRemove):
    authentication_classes = [CustomAuthentication]
    swagger_schema = None
