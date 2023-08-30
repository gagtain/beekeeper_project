import asyncio
import datetime

import nest_asyncio

from global_modules.email.core.contextEmail import ContextEmail
from user.tasks import sending_user_code_auth_task


class UserService:

    @classmethod
    def sending_user_code_auth(cls, user_email, code, async_=False):
        if async_:
            sending_user_code_auth_task.delay(code=code, user_email=user_email)
        else:
            sending_user_code_auth_task(code=code, user_email=user_email)
