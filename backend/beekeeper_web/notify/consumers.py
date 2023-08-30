from asgiref.sync import sync_to_async
from django.db.models import QuerySet
from djangochannelsrestframework.decorators import action
from djangochannelsrestframework.generics import GenericAsyncAPIConsumer
from djangochannelsrestframework.observer import model_observer
from djangochannelsrestframework.observer.generics import ObserverModelInstanceMixin
from rest_framework.utils import json

from notify.models import Notify
from notify.serializers import NotifySerializer, IsViewedConsumersSerializer
from notify.services.fixed import FixedRussianData


class NotifyConsumers(FixedRussianData, ObserverModelInstanceMixin, GenericAsyncAPIConsumer):
    queryset = Notify.objects.all()
    serializer_class = NotifySerializer
    user_subscribe = None

    @action()
    async def is_viewed(self, **kwargs):
        await sync_to_async(Notify.objects.create)(type=Notify.NotifyChoice.news, text='123', all=True)
        serializer = IsViewedConsumersSerializer(data=kwargs)
        serializer.is_valid(raise_exception=True)
        notify_id_list: list[int] = self.scope
        notify_list = self.filter_queryset(queryset=self.get_queryset(),
                                           id__in=notify_id_list)
        notify_list.update(is_viewed=True)

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
        if instance.all:
            yield f"all__True"
        else:
            yield f"users__{instance.users.pk}"
        yield f'pk__{instance.pk}'

    @notify_activity.groups_for_consumer
    def notify_activity(self, user=None, *args, **kwargs):
        if user is not None:
            if user != 'all':
                yield f'users__{user}'
            else:
                yield f'all__True'

    @notify_activity.serializer
    def notify_activity(self, instance: Notify, action):
        serializer = NotifySerializer(instance)
        return dict(
            data=serializer.data,
            action=action.value,
            pk=instance.pk
        )
