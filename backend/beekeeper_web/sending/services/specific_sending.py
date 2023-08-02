import datetime
import json

from sending.tasks import specific_sending
from django_celery_beat.models import PeriodicTask, IntervalSchedule


def create_specific_sending(sending):
    if sending.periods:
        intervar, _ = IntervalSchedule.objects.get_or_create(
            every=1,
            period=IntervalSchedule.DAYS
        )
        period_task = PeriodicTask.objects.create(
            name=sending.name,
            interval=intervar,
            task="sending.tasks.specific_sending",
            start_time=sending.data,
            kwargs=json.dumps({'sending_id': sending.id})
        )

        task_id = period_task.id
    else:
        task_id = specific_sending.delay(sending_id=sending.id)
    return task_id
