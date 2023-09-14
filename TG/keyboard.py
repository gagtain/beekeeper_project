from aiogram import types


button_reg = types.InlineKeyboardButton(text="Регистрация", callback_data="register")

kb_reg = types.InlineKeyboardMarkup(inline_keyboard=[[
    button_reg
]])

