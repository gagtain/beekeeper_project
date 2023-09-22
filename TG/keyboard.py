from aiogram import types


button_log = types.InlineKeyboardButton(text="Вход", callback_data="login")

kb_log = types.InlineKeyboardMarkup(inline_keyboard=[[
    button_log
]])

button_sending_code_examination = types.InlineKeyboardButton(text="Проверить статус отправки уведомлений",
                                                             callback_data="check_code_sending")
kb_sending_examination = types.InlineKeyboardMarkup(inline_keyboard=[[
    button_sending_code_examination
]])

button_sending_code_activate = types.KeyboardButton(text="Включить отправку уведомлений")

kb_sending_code_activate = types.ReplyKeyboardMarkup(keyboard=[[
    button_sending_code_activate
]])


button_sending_code_deactivate = types.KeyboardButton(text="Выключить отправку уведомлений")

kb_sending_code_deactivate = types.ReplyKeyboardMarkup(keyboard=[[
    button_sending_code_deactivate
]])