from rest_framework.response import Response
from rest_framework.views import APIView

from beekeeper_web_api.models import Order
from delivery.dilivery_core.Client import Configuration
from delivery.dilivery_core.core import SdekDelivery
from delivery.dilivery_core.shemas.Delivery import DeliveryAdd, DeliveryResponseAdd
from delivery.models import DeliveryTransaction
from delivery.serializers import DeliveryTransactionSerializer
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



class DeliverySdekGet(APIView):

    def delivery_sdek_get(self, request, uuid):
        a = SdekDelivery.SDEKDelivery.get_delivery(uuid)
        return Response({'sdek': a.json()})

class DeliveryGet(APIView):

    def delivery_get(self, request, pk):
        return Response(DeliveryTransactionSerializer(DeliveryTransaction.objects.get(pk=pk)).data)

class DeliverySubmitWaiting(APIView):

    def delivery_submit_waiting(self, request, pk):
        delivery: DeliveryTransaction = DeliveryTransaction.objects.get(pk=pk)
        delivery.status = DeliveryTransaction.DeliveryStatus.Waiting_for_dispatch
        delivery.save()
        return Response(DeliveryTransactionSerializer(instance=delivery).data)

class DeliveryTrackAdd(APIView):

    def delivery_track_add(self, request, pk):
        delivery: DeliveryTransaction = DeliveryTransaction.objects.get(pk=pk)
        delivery.track_number = request.data['track_number']
        delivery.status = DeliveryTransaction.DeliveryStatus.Sent
        delivery.save()
        return Response(DeliveryTransactionSerializer(instance=delivery).data)
