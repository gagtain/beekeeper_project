from functools import partial

from django.db.models import Model
from djangochannelsrestframework.observer import ModelObserver


class ModelObserverRefactorPostReceiver(ModelObserver):
    def post_init_receiver(self, instance: Model, **kwargs):

        if instance.pk is None:
            current_groups = set()
        else:
            current_groups = set(self.group_names_for_signal(instance=instance, type='receiver'))

        self.get_observer_state(instance).current_groups = current_groups



def model_observer(model, **kwargs):
    return partial(ModelObserverRefactorPostReceiver, model_cls=model, kwargs=kwargs)