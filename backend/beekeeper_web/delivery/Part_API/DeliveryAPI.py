from django.db.models import QuerySet
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from orders.models import Order
from delivery.dilivery_core.Client import Configuration
from delivery.dilivery_core.core import SdekDelivery
from delivery.dilivery_core.shemas.Delivery import DeliveryAdd, DeliveryResponseAdd
from delivery.models import DeliveryTransaction
from delivery.serializers import DeliveryTransactionSerializer, DeliveryTransactionCreateSerializer
from delivery.services.Delivery import DeliveryService


class DeliveryCreate(APIView):



    def delivery_initial_in_data(self, request):
        delivery = DeliveryAdd(**request.data['delivery_info'])
        a = SdekDelivery.SDEKDelivery.create_delivery(delivery)
        delivery_class = DeliveryResponseAdd(**a.json())
        delivery = DeliveryTransaction.objects.get(id=request.data['delivery_id'])
        delivery.uuid = delivery_class.entity['uuid']
        """Необходимо добавить выбор модели заказа и сервиса как в приложении payments"""
        delivery.save()
        return Response({'sdek': a.json()})

    def delivery_create_lait(self, request: Request):
        """Заглушка, будет удалено при дальнейшем рефакторе"""
        order = Order.objects.get(id=request.data['order_id'])
        print(request.data)
        print(request.data.get('user_number', order.user.number))
        serializer = DeliveryTransactionCreateSerializer(data={
            'uuid': '122',
            'where': request.data.get('PVZ'),
            'price': request.data.get('price'),
            'number': request.data.get('user_number', order.user.number),
            'order_delivery_transaction': [order.id]
        },)
        serializer.is_valid(raise_exception=True)
        delivery = serializer.save()
        return Response(data=DeliveryTransactionSerializer(delivery).data, status=200)


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
