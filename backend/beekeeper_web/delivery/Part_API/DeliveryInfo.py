from pprint import pprint

from rest_framework.response import Response

from delivery.DeliveryInfo.Delivery.Absract.AbstactDeliveryEngine import AbstractDeliveryEngine
from delivery.DeliveryInfo.Delivery.enum.DeliveryEngine import DeliveryEngine
from delivery.serializers import DeliveryEngineChoiceSerializers


class DeliveryInfo:
    def get_info_in_order(self, request, pk):
        serializer = DeliveryEngineChoiceSerializers(data=request.data)
        serializer.is_valid(raise_exception=True)
        delivery_engine_enum = getattr(DeliveryEngine, request.data['delivery_engine']).value
        delivery_engine: AbstractDeliveryEngine = delivery_engine_enum(data=request.data, delivery_pk=pk)
        pprint(delivery_engine.__dir__().to_dict())
        return Response(data=delivery_engine.__dir__().to_dict(), status=200)


