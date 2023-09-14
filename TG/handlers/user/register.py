
from aiogram import types, Router
from aiogram.fsm.context import FSMContext
from aiogram import F

from forms.register import Form
from http_api.exceptions.exception import UserUnauthorized
from http_api.user.auth import AuthUser
from http_api.user.schemas.auth import UserAuthRequest
from services.auth import AuthServices

router = Router()


@router.callback_query(F.data == 'register')
async def register(callback_query: types.CallbackQuery, state: FSMContext):
    await state.set_state(Form.username)
    await callback_query.message.answer(text="Укажите ваш username")
    await callback_query.answer()


@router.message(Form.username)
async def set_username(message: types.Message, state: FSMContext) -> None:
    await state.update_data(username=message.text)
    await state.set_state(Form.password)
    await message.answer(text="Укажите пароль")


@router.message(Form.password)
async def set_password(message: types.Message, state: FSMContext) -> None:
    await state.update_data(password=message.text)
    await message.answer(text="Отправил пароль")
    data = await state.get_data()
    user_data = UserAuthRequest(username=data.get('username'), password=data.get('password'))
    try:
        await AuthUser.auth_user(user_data=user_data)
        await state.clear()
    except UserUnauthorized as e:
        await message.answer(text=e.data)
        await message.answer(text="Укажите логин")
        await AuthServices.auth_state_again(state=state)
