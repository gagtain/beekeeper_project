import enum
import json
from typing import Callable, Any
from django.core.cache import cache
from asgiref.sync import async_to_sync
from rest_framework import status

from beekeeper_web_api.services.cache_keys import user_authorization_token
from global_modules.exception.base import CodeDataException
from user.models import MainUser
from user.tasks import sending_user_code_auth_task
from user_service.service.telegram import send_message


class UserService:

    @classmethod
    def sending_user_code_auth(cls, user: MainUser, code, async_=False):
        if async_:
            sending_user_code_auth_task.delay(code=code, user_email=user.email)
        else:
            sending_user_code_auth_task(code=code, user_email=user.email)

    @classmethod
    def sending_user_code_auth_telegram(cls, user: MainUser, code, async_=False):
        async_to_sync(send_message)(
            from_=user.telegram.telegram_id, message=f"Ваш код подтверждения: {code}"
        )

    @classmethod
    def get_is_sending_code(cls, user: MainUser) -> bool:
        try:
            user_telegram = user.telegram.is_sending_code
        except:
            user_telegram = False
        sending_field = [
            user.is_email_authorization,
            user_telegram
        ]
        if True in sending_field:
            return True
        else:
            return False

    @classmethod
    def sending_user_auth_code(cls, user: MainUser, type_=None) -> Callable[[MainUser, Any, bool], None]:
        try:
            user_telegram = user.telegram.is_sending_code
        except:
            user_telegram = False
        sending_field_and_func = {
            'email': (
                user.is_email_authorization,
                cls.sending_user_code_auth
            ),
            'telegram': (
                user_telegram,
                cls.sending_user_code_auth_telegram
            )
        }
        if type_ is None:
            for value in sending_field_and_func.values():
                if value[0]:
                    return value[1]
        else:
            if sending_field_and_func.get(type_, None) is not None:
                if sending_field_and_func[type_][0]:
                    return sending_field_and_func[type_][1]
                else:
                    raise CodeDataException(status=status.HTTP_400_BAD_REQUEST,
                                            error="Выбранный тип авторизации не подключен")
            else:
                raise CodeDataException(status=status.HTTP_400_BAD_REQUEST,
                                        error="Выбранный тип авторизации не существует")


class TelegramSendingInitial:

    def __init__(self, user: MainUser, message, ex_message):
        self.user = user
        self.message = message
        self.ex_message = ex_message

    def __is_sending(self):
        is_telegram = self.user.telegram.is_sending_code if self.user.telegram is not None else False
        if not is_telegram:
            raise CodeDataException(status=status.HTTP_400_BAD_REQUEST,
                                    error="Выбранный тип авторизации не подключен")

    def sending(self):
        self.__is_sending()
        key_sending = user_authorization_token(user_id=self.user.id)
        try:
            data = cache.get("sending_telegram_code")
            json_data: dict = json.loads(data)
        except:
            json_data = {'sending': []}
        json_data['sending'].append({
            "chat_id": self.user.telegram.telegram_id,
            "message": self.message,
            "id": key_sending


        })
        cache.set("sending_telegram_code", json.dumps(obj=json_data, ensure_ascii=False), 60 * 5)
        cache.set(key_sending, self.ex_message, 60 * 5)


class EmailSendingInitial:

    def __init__(self, user, message, ex_message):
        self.user = user
        self.message = message
        self.ex_message = ex_message

    def __is_sending(self):
        if not self.user.is_email_authorization:
            raise CodeDataException(status=status.HTTP_400_BAD_REQUEST,
                                    error="Выбранный тип авторизации не подключен")

    def sending(self):
        self.__is_sending()
        key_sending = user_authorization_token(user_id=self.user.id)
        try:
            data = cache.get("sending_email_code")
            json_data: dict = json.loads(data)
        except:
            json_data = {'sending': []}
        json_data['sending'].append({
            "email": self.user.email,
            "message": self.message,
            "id": key_sending

        })
        cache.set("sending_email_code", json.dumps(obj=json_data, ensure_ascii=False), 60 * 5)
        cache.set(key_sending, self.ex_message, 60 * 5)


class UserSendingType(enum.Enum):
    telegram = TelegramSendingInitial
    email = EmailSendingInitial

    @classmethod
    def get_sending(cls, sending_type: str, user: MainUser, message: str, ex_message=None):
        try:
            return cls[sending_type].value(user=user, message=message, ex_message=ex_message)
        except KeyError:
            raise CodeDataException(status=status.HTTP_400_BAD_REQUEST,
                                    error="Выбранный тип авторизации не существует")
