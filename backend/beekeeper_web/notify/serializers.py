from rest_framework import serializers

from notify.models import Notify


class NotifySerializer(serializers.ModelSerializer):
    class Meta:
        model = Notify
        fields = '__all__'

class IsViewedListSerializer(serializers.Serializer):
    notify_id_list = serializers.ListField()

    class Meta:
        fields = ('notify_id_list',)

class IsViewedConsumersSerializer(serializers.Serializer):
    data = IsViewedListSerializer()


    class Meta:
        field = ('data',)