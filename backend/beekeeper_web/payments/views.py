from django.shortcuts import render
from rest_framework import viewsets

from beekeeper_web_api.serializers import RatingProductReviewSerializer
from .PartAPI.PaymentsAPI import CreatePaymentsAPI
from .PartAPI.Yookassa import YookassaNotifications


# Create your views here.


class PaymentAPI(viewsets.ViewSet, CreatePaymentsAPI):
    pass

class YookassaAPI(viewsets.ViewSet, YookassaNotifications):
    swagger_schema = None