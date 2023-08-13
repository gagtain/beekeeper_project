from pprint import pprint
from time import sleep

from django.db.models import QuerySet, Prefetch
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from delivery.services.optimize_orm.collect import default_delivery_optimize
from orders.models import Order
from delivery.dilivery_core.Client import Configuration
from delivery.dilivery_core.core import SdekDelivery
from delivery.dilivery_core.shemas.Delivery import DeliveryAdd, DeliveryResponseAdd
from delivery.models import DeliveryTransaction
from delivery.serializers import DeliveryTransactionSerializer, DeliveryTransactionCreateSerializer
from delivery.services.Delivery import DeliveryService, Sent_Status
from orders.services.optimize_orm import default_order_optimize


class DeliveryCreate(APIView):



    def delivery_initial_in_data(self, request):
        delivery = DeliveryTransaction.objects.get(id=request.data['delivery_id'])
        print(delivery.status, Sent_Status)
        if delivery.status in Sent_Status:
            return Response(data={'error': 'Доставка уже отправлена'}, status=400)
        elif delivery.status == DeliveryTransaction.DeliveryStatus.Under_review:
            return Response(data={'error': 'Доставка еще не подтверждена'}, status=400)
        elif delivery.status == DeliveryTransaction.DeliveryStatus.closed:
            return Response(data={'error': 'Доставка отменена'}, status=400)
        delivery_add = DeliveryAdd(**request.data['delivery_info'])
        a = SdekDelivery.SDEKDelivery.create_delivery(delivery_add)
        delivery_response_class = DeliveryResponseAdd(**a.json())
        sleep(1)
        delivery_sdek = SdekDelivery.SDEKDelivery.get_delivery(uuid=delivery_response_class.entity['uuid'])
        delivery.track_number = delivery_sdek.json()['entity']['cdek_number']
        delivery.uuid = delivery_response_class.entity['uuid']
        delivery.status = DeliveryTransaction.DeliveryStatus.Sent
        """Необходимо добавить выбор модели заказа и сервиса как в приложении payments"""
        delivery.save()
        return Response({'sdek': a.json()})

    def delivery_create_lait(self, request: Request):
        """Заглушка, будет удалено при дальнейшем рефакторе"""
        order = Order.objects.select_related('user').only('user', 'user__number', 'id')\
            .get(id=request.data.get('order_id'))
        serializer = DeliveryTransactionCreateSerializer(data={
            'uuid': '122',
            'where': request.data.get('PVZ'),
            'price': request.data.get('price'),
            'number': request.data.get('user_number', order.user.number),
            'order_delivery_transaction': [order.id]
        },)
        serializer.is_valid(raise_exception=True)
        delivery_ = serializer.save()
        delivery = default_delivery_optimize(DeliveryTransaction.objects).get(id=delivery_.id)
        return Response(data=DeliveryTransactionSerializer(delivery).data, status=200)


class DeliverySdekGet(APIView):

    def delivery_sdek_get(self, request, uuid):
        a = SdekDelivery.SDEKDelivery.get_delivery(uuid)
        return Response({'sdek': a.json()})


class DeliveryGet(APIView):

    def delivery_get(self, request, pk):
        delivery_obj = default_delivery_optimize(DeliveryTransaction.objects).get(pk=pk)
        return Response(DeliveryTransactionSerializer(delivery_obj).data)


class DeliverySubmitWaiting(APIView):

    def delivery_submit_waiting(self, request, pk):
        delivery: DeliveryTransaction = DeliveryTransaction.objects.only('status').get(pk=pk)
        delivery.status = DeliveryTransaction.DeliveryStatus.Waiting_for_dispatch
        delivery.save()
        return Response(DeliveryTransactionSerializer(instance=delivery).data)


class DeliveryTrackAdd(APIView):

    def delivery_track_add(self, request, pk):
        delivery: DeliveryTransaction = DeliveryTransaction.objects.only('status', 'track_number', 'id').get(pk=pk)
        delivery.track_number = request.data['track_number']
        delivery.status = DeliveryTransaction.DeliveryStatus.Sent
        delivery.save()
        return Response(DeliveryTransactionSerializer(instance=delivery).data)
