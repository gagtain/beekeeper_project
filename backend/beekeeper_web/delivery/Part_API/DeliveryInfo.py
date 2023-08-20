from pprint import pprint

from rest_framework.response import Response

from delivery.DeliveryInfo.Delivery.Absract.AbstactDeliveryEngine import AbstractDeliveryEngine
from delivery.DeliveryInfo.Delivery.enum.DeliveryEngine import DeliveryEngine
from delivery.serializers import DeliveryEngineChoiceSerializers
from global_modules.exception.base import BaseDataException


class DeliveryInfo:
    def get_info_in_order(self, request, pk):
        serializer = DeliveryEngineChoiceSerializers(data=request.data)
        serializer.is_valid(raise_exception=True)
        delivery_engine_enum = getattr(DeliveryEngine, request.data['delivery_engine']).value
        try:
            delivery_engine_enum.examination_data(request.data)
        except BaseDataException as e:
            return Response(data=e.error_data, status=400)

        delivery_engine: AbstractDeliveryEngine = delivery_engine_enum(data=request.data, delivery_pk=pk,
                                                                       request=request)
        try:
            data = delivery_engine.get_info().to_dict()
            return Response(data=data, status=200)
        except AttributeError as e:
            return Response(data={'errors': {
                'descriptions': 'Неверно указан атрибут',
                'original_errors': str(e)
            }})
