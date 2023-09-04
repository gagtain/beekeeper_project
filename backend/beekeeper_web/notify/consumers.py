from asgiref.sync import sync_to_async
from channels.db import database_sync_to_async
from django.db.models import QuerySet
from djangochannelsrestframework.decorators import action
from djangochannelsrestframework.generics import GenericAsyncAPIConsumer
from djangochannelsrestframework.observer import model_observer
from djangochannelsrestframework.observer.generics import ObserverModelInstanceMixin
from djangochannelsrestframework.permissions import IsAuthenticated
from drf_yasg.utils import swagger_auto_schema
from rest_framework.utils import json

from notify.models import Notify
from notify.serializers import NotifySerializer, IsViewedConsumersSerializer
from notify.services.fixed import FixedRussianData
from notify.services.notify_websocket import get_key_code_notify_websocket_message, \
    get_key_code_user_notify_websocket_message


class NotifyConsumers(FixedRussianData, ObserverModelInstanceMixin, GenericAsyncAPIConsumer):
    """ Класс реализующий подписку на прослушивание уведомлений (частных и общих) """
    queryset = Notify.objects.all()
    serializer_class = NotifySerializer
    permission_classes = [IsAuthenticated]


    @action()
    async def is_viewed(self, **kwargs):
        serializer = IsViewedConsumersSerializer(data=kwargs)
        serializer.is_valid(raise_exception=True)
        notify_id_list: list[int] = kwargs.get('notify_id_list', [])
        notify_list = self.filter_queryset(queryset=self.get_queryset(),
                                           id__in=notify_id_list)
        notify_list.update(is_viewed=True)

    @action()
    async def get_old_notify(self, **kwargs):
        size = kwargs.get('size', 10)
        from_ = kwargs.get('from', 0)
        queryset = await self.get_notify_filter()
        queryset = queryset.order_by("-id")[from_:size+from_]
        serializer = NotifySerializer(queryset, many=True, context={
            'user_id': self.scope["user"].id
        })
        data = {
            'data': await sync_to_async(self.get_serializer_data)(serializer),
            'type': 'old_notify'
                }
        await self.send_json(data)

    @action()
    async def subscribe_to_notify(self, **kwargs):
        if kwargs.get('all_notify'):
            await self.notify_activity.subscribe(user='all')
        else:
            await self.notify_activity.subscribe(user=self.scope["user"].id)

    @model_observer(Notify)
    async def notify_activity(self, notify, *args, **kwargs):
        await self.send_json(notify)

    @notify_activity.groups_for_signal
    def notify_activity(self, instance: Notify, *args, **kwargs):
        return get_key_code_notify_websocket_message(instance)

    @notify_activity.groups_for_consumer
    def notify_activity(self, user=None, *args, **kwargs):
        return get_key_code_user_notify_websocket_message(user)

    def get_serializer_data(self, serializer):
        return serializer.data
    @notify_activity.serializer
    def notify_activity(self, instance: Notify, action, **kwargs):
        serializer = NotifySerializer(instance)
        return dict(
            data=serializer.data,
            action=action.value,
            pk=instance.pk,
            type='subscribe'
        )

    @database_sync_to_async
    def get_notify(self, **kwargs):
        return self.get_queryset().get(**kwargs)

    @database_sync_to_async
    def get_notify_filter(self, **kwargs):
        return self.filter_queryset(self.get_queryset(), **kwargs)

