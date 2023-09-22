import enum
from functools import partial

from aiogram import types
from sqlalchemy.orm import load_only

from db import UserTelegram


async def is_only_id(message: types.Message | types.CallbackQuery):
    telegram_user: UserTelegram = await UserTelegram.objects.get(
        UserTelegram.telegram_id == str(message.from_user.id),
        options=load_only(UserTelegram.user_id)
    )
    user_id = telegram_user.user_id
    return {
        "user_id": user_id
    }


async def user_telegram_field_default(message: types.Message):
    telegram_user: UserTelegram = await UserTelegram.objects.get(
        UserTelegram.telegram_id == str(message.from_user.id),
        options=load_only(UserTelegram.user_id, UserTelegram.telegram_id, UserTelegram.is_sending_code)
    )
    return {
        "user": telegram_user
    }


class UserTypeEnum(enum.Enum):
    is_only_id = partial(is_only_id)
    max_fields = 2
    default_field = 3
    user_telegram_field_def = partial(user_telegram_field_default)

    async def __call__(self, message: types.Message):
        return await self.value(message)
