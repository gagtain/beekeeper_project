from django.shortcuts import render
from rest_framework import viewsets

from beekeeper_web_api.serializers import RatingProductReviewSerializer
from .PartAPI.PaymentsAPI import CreatePaymentsAPI


# Create your views here.


class PaymentAPI(viewsets.ViewSet, CreatePaymentsAPI):
    pass