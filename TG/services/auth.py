from aiogram import types
from aiogram.fsm.context import FSMContext

from db.manager import ObjectNotFound
from forms.register import Form
from services.Permissions import is_auth
from services.UserType import UserTypeEnum


class AuthServices:

    @classmethod
    async def auth_state_again(cls, state: FSMContext):
        await state.set_state(Form.username)

    @classmethod
    def user_auth(cls, auth=is_auth, user_type:UserTypeEnum = UserTypeEnum.is_only_id):

        def decorator(func):

            async def wrapper(message: types.Message | types.CallbackQuery, *args, **kwargs):
                try:
                    data = await user_type(message=message)
                except ObjectNotFound:
                    data = None
                if auth(user=data):
                    return await func(message, *args, **kwargs, **data)
                else:
                    await message.answer("Не достаточный уровень доступа")
                    return
            return wrapper

        return decorator


