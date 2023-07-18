from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView

from delivery.Part_API.DeliveryAPI import DeliveryCreate, DeliverySdekGet, DeliveryGet, DeliverySubmitWaiting, \
    DeliveryTrackAdd
from delivery.Part_API.Search import DeliveryTransactionFilter
from delivery.dilivery_core.core.SdekDelivery import SDEKDelivery
from delivery.dilivery_core.shemas.Delivery import DeliveryAdd
from rest_framework.viewsets import ViewSet

# Create your views here.


class DeliveryAPI(ViewSet, DeliveryCreate, DeliverySdekGet,
                  DeliveryTransactionFilter, DeliveryGet, DeliverySubmitWaiting, DeliveryTrackAdd):
    pass
