
from aiogram import types, Router
from aiogram.fsm.context import FSMContext
from aiogram import F

from db import MainUser
from db.service.user import login_user_telegram
from forms.register import Form
from http_api.exceptions.exception import UserUnauthorized, UserNoCode, UserNoValidateCode
from http_api.user.auth import AuthUser
from http_api.user.schemas.auth import UserAuthRequest
from services.auth import AuthServices

router = Router()


@router.callback_query(F.data == 'login')
async def login(callback_query: types.CallbackQuery, state: FSMContext):

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
    data = await state.get_data()
    user_data = UserAuthRequest(username=data.get('username'), password=data.get('password'))
    try:
        await AuthUser.auth_user(user_data=user_data)
        await message.answer("Успешно")
        await state.clear()
    except UserUnauthorized as e:
        await message.answer(text=e.data)
        await message.answer(text="Укажите логин")
        await AuthServices.auth_state_again(state=state)
    except UserNoCode:
        await AuthUser.set_token_user(user_data=user_data)
        await message.answer(text="Укажите код")
        await state.set_state(Form.code)
    except UserNoValidateCode as e:
        await message.answer(text="Укажите код")
        await state.set_state(Form.code)

@router.message(Form.code)
async def validate_code(message: types.Message, state: FSMContext) -> None:
    code = message.text
    data = await state.get_data()
    user_data = UserAuthRequest(username=data.get('username'), password=data.get('password'), token=code)
    try:
        data = await AuthUser.auth_user(user_data=user_data)
        await message.answer("Успешно")
        verif_data = await AuthUser.verif_token_user(data['access'])
        user = await MainUser.objects.get(MainUser.username == verif_data.get('username'))
        await login_user_telegram(user_id=user.id, telegram_id=message.from_user.id)
        await state.clear()
    except UserUnauthorized as e:
        await message.answer(text=e.data)
        await message.answer(text="Укажите логин")
        await AuthServices.auth_state_again(state=state)
    except UserNoValidateCode as e:
        await message.answer(text=e.data)
        await message.answer(text="Укажите код заново")
        await state.set_state(Form.code)



