from rest_framework.response import Response
from rest_framework.views import APIView

from beekeeper_web_api.models import Order
from delivery.dilivery_core.Client import Configuration
from delivery.dilivery_core.core import SdekDelivery
from delivery.dilivery_core.shemas.Delivery import DeliveryAdd, DeliveryResponseAdd
from delivery.models import DeliveryTransaction
from delivery.services.Delivery import DeliveryService


class DeliveryCreate(APIView):

    def delivery_create(self, request):
        delivery = DeliveryAdd(**request.data['delivery'])
        a = SdekDelivery.SDEKDelivery.create_delivery(delivery)
        delivery_class = DeliveryResponseAdd(**a.json())
        delivery = DeliveryTransaction.objects.create(uuid=delivery_class.entity['uuid'])
        """Необходимо добавить выбор модели заказа и сервиса как в приложении payments"""
        order = Order.objects.get(id=request.data['order_id'])
        DeliveryService.add_delivery_in_order(delivery, order)
        return Response({'sdek': a.json()})



class DeliveryGet(APIView):

    def delivery_get(self, request, uuid):
        a = SdekDelivery.SDEKDelivery.get_delivery(uuid)
        return Response({'sdek': a.json()})