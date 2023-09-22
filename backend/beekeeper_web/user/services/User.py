
from typing import Callable, Any

from asgiref.sync import async_to_sync
from rest_framework import status

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
        sending_field = [
            user.is_email_authorization,
            user.telegram.is_sending_code if user.telegram is not None else False
        ]
        if True in sending_field:
            return True
        else:
            return False

    @classmethod
    def sending_user_auth_code(cls, user: MainUser, type_=None) -> Callable[[MainUser, Any, bool], None]:
        sending_field_and_func = {
            'email': (user.is_email_authorization, cls.sending_user_code_auth),
            'telegram': (
                user.telegram.is_sending_code if user.telegram is not None else False,
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


