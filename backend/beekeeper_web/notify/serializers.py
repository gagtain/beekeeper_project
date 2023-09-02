from rest_framework import serializers

from notify.models import Notify


class NotifySerializer(serializers.ModelSerializer):
    is_viewed = serializers.SerializerMethodField()
    class Meta:
        model = Notify
        fields = ('id', 'type', 'text', 'is_viewed', 'all')

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