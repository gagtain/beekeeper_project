from aiogram import Router, types, F
from aiogram.fsm.context import FSMContext

from db import UserTelegram
from keyboard import kb_sending_code_activate, kb_sending_code_deactivate
from services.UserType import UserTypeEnum
from services.auth import AuthServices

router = Router()


@router.callback_query(F.data == "check_code_sending")
@AuthServices.user_auth(user_type=UserTypeEnum.user_telegram_field_def)
async def check_code_sending(callback_query: types.CallbackQuery, state: FSMContext, user: UserTelegram, **kwargs):
    if user.is_sending_code:
        await callback_query.message.answer("Отправка кодов подтверждения включена",
                                            reply_markup=kb_sending_code_deactivate)
        await callback_query.answer()
    else:
        await callback_query.message.answer("Отправка кодов подтверждения выключена",
                                            reply_markup=kb_sending_code_activate)
        await callback_query.answer()


@router.message(F.text == "Включить отправку уведомлений")
@AuthServices.user_auth(user_type=UserTypeEnum.user_telegram_field_def)
async def activate_code_sending(message: types.Message, user: UserTelegram, **kwargs):
    if user.is_sending_code:
        await message.answer("У вас уже включена отправка уведомлений", reply_markup=types.ReplyKeyboardRemove())
    else:
        await message.answer("Включаем", reply_markup=types.ReplyKeyboardRemove())
        user.is_sending_code = True
        await user.objects.save(user)
        await message.answer("Отправка уведомлений включена")


@router.message(F.text == "Выключить отправку уведомлений")
@AuthServices.user_auth(user_type=UserTypeEnum.user_telegram_field_def)
async def activate_code_sending(message: types.Message, user: UserTelegram, **kwargs):
    if not user.is_sending_code:
        await message.answer("У вас уже выключена отправка уведомлений", reply_markup=types.ReplyKeyboardRemove())
    else:
        await message.answer("Выключаем", reply_markup=types.ReplyKeyboardRemove())
        user.is_sending_code = False
        await user.objects.save(user)
        await message.answer("Отправка уведомлений отключена")
