import asyncio
import datetime
from email.mime.text import MIMEText
from typing import Callable

import aiosmtplib
from asgiref.sync import sync_to_async, async_to_sync
from celery import shared_task

from global_modules.email.core.basic import AsyncEmail
from global_modules.email.core.contextEmail import ContextEmail


@shared_task()
def sending_user_code_auth_task(code, user_email):
    asyncio.run(generete_tasks(func=[send_user_code(code, user_email)]))


async def generete_tasks(func):
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