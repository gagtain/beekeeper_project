from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView

from delivery.dilivery_core.core.SdekDelivery import SDEKDelivery
from delivery.dilivery_core.shemas.Delivery import DeliveryAdd


# Create your views here.


class A(APIView):

    def get(self, request):

        return Response(SDEKDelivery.get_token())