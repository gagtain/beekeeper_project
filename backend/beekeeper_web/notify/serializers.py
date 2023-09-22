import copy
from collections import OrderedDict

from rest_framework import serializers
from rest_framework.fields import empty, SkipField
from rest_framework.relations import PKOnlyObject
from rest_framework.serializers import ListSerializer, Serializer, ModelSerializer
from rest_framework.settings import api_settings
from rest_framework.utils import model_meta

from delivery.models import DeliveryTransaction
from delivery.serializers import DeliveryTransactionSerializer
from notify.models import Notify
from orders.models import Order


class NotifySerializer(serializers.ModelSerializer):
    is_viewed = serializers.SerializerMethodField()

    class Meta:
        is_many = False
        model = Notify
        fields = ['id', 'type', 'text', 'is_viewed', 'all']
        additional_field = {
            'order': 'pk',
            'delivery': DeliveryTransactionSerializer

        }

    def to_representation(self, instance):
        data = super().to_representation(instance=instance)
        dict_addit = self.get_additional_fields(instance=instance)
        if dict_addit is not {}:
            data = data | dict_addit

        return data

    def __init__(self, instance: Notify = None, data: dict = empty, **kwargs):
        if not self.Meta.is_many:
            if instance is not None:
                self.append_fields_relate_in_type(type_=instance.type)
            elif data != empty:
                if data.get('type'):
                    self.append_fields_relate_in_type(data['type'])
        super().__init__(instance=instance, data=data, **kwargs)

    def __new__(cls, *args, **kwargs):
        if kwargs.get('many'):
            cls.Meta.is_many = True
        return super().__new__(cls, *args, **kwargs)

    def append_fields_relate_in_type(self, type_: str):
        addit_fields = []
        if type_ == Notify.NotifyChoice.order:
            self.Meta.fields.append('order')
            addit_fields.append('order')
        if type_ == Notify.NotifyChoice.delivery:
            self.Meta.fields.append('delivery')
            addit_fields.append('delivery')
        return addit_fields

    def get_additional_fields(self, instance: Notify) -> dict | None:
        fields_addit = self.append_fields_relate_in_type(type_=instance.type)
        self.remove_fields_relate_in_type(type_=instance.type)
        fields = {}
        for field in fields_addit:
            if field is not None:
                serializer = self.Meta.additional_field.get(field)
                if serializer == 'pk':
                    obj = getattr(instance, field)
                    if obj is not None:

                        fields[field] = getattr(instance, field).pk
                    else:
                        fields[field] = None
                else:
                    fields[field] = serializer(getattr(instance, field)).data
        return fields

    def remove_fields_relate_in_type(self, type_: str):
        if type_ == Notify.NotifyChoice.order:
            self.Meta.fields.remove('order')
        elif type_ == Notify.NotifyChoice.delivery:
            self.Meta.fields.remove('delivery')

    def get_is_viewed(self, instance: Notify, *args, **kwargs):
        if not self.context.get('user_id'):
            return False

        if instance.is_viewed.filter(pk=self.context.get('user_id')).exists():
            return True
        else:
            return False


class IsViewedListSerializer(serializers.Serializer):
    notify_id_list = serializers.ListField(child=serializers.PrimaryKeyRelatedField(queryset=Notify.objects.all()))

    class Meta:
        fields = ('notify_id_list',)


class IsViewedConsumersSerializer(serializers.Serializer):
    data = IsViewedListSerializer()

    class Meta:
        field = ('data',)
