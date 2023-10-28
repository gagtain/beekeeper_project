import asyncio
import datetime
import json
from email.mime.text import MIMEText
from typing import Callable, Coroutine

import aiosmtplib
from asgiref.sync import sync_to_async, async_to_sync
from celery import shared_task
from django.core.cache import cache

from global_modules.email.core.basic import AsyncEmail
from global_modules.email.core.contextEmail import ContextEmail
from user_service.service.telegram import send_message


@shared_task()
def sending_user_code_auth_task(code, user_email):
    asyncio.run(generete_tasks(func=[send_user_code(code, user_email)]))


@shared_task()
def sending_user_code_in_cache_task():
    keys_sending_email = cache.get('sending_email_code')
    if keys_sending_email is None:
        return
    try:
        data = json.loads(keys_sending_email)
        task_list = []
        for sending_data in data['sending']:
            task_list.append(send_user_email_message(message=sending_data['message'],
                                                     user_email=sending_data['email']))
        asyncio.run(generete_tasks(func=task_list))
        cache.delete('sending_email_code')
    except Exception as e:
        print(e)

@shared_task()
def sending_user_code_telegram_in_cache_task():
    keys_sending_email = cache.get('sending_telegram_code')
    if keys_sending_email is None:
        return
    try:
        data = json.loads(keys_sending_email)
        task_list = []
        for sending_data in data['sending']:
            task_list.append(send_message(message=sending_data['message'], from_=sending_data['chat_id']))
        asyncio.run(generete_tasks(func=task_list))
        cache.delete('sending_email_code')
    except Exception as e:
        print(e)
async def generete_tasks(func: list[Coroutine]):
    async with asyncio.TaskGroup() as th:
        for i in func:
            th.create_task(
                i
            )
async def send_user_code(code, user_email):
    email_engine = AsyncEmail(server="smtp.gmail.com", port=587)
    async with email_engine as e:
        e.text_in_string(f"Ваш код авторизации: {code}")
        await e.send_message(client=user_email)


async def send_user_email_message(message, user_email):
    email_engine = AsyncEmail(server="smtp.gmail.com", port=587)
    print(1234213)
    async with email_engine as e:
        e.text_in_string(message)
        await e.send_message(client=user_email)