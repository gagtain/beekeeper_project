from aiogram.fsm.context import FSMContext

from forms.register import Form


class AuthServices:

    @classmethod
    async def auth_state_again(cls, state: FSMContext):
        await state.set_state(Form.username)

    @classmethod
    def user_auth(cls, func):
        async def wrapper(message, *args, **kwargs):
            return await func(message, user=1)

        return wrapper


