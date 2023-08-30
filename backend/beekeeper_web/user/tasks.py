from celery import shared_task

from global_modules.email.core.contextEmail import ContextEmail


@shared_task()
def sending_user_code_auth_task(code, user_email):
    email_ = ContextEmail(server="smtp.gmail.com", port=587)
    with email_ as e:
        e.text_in_string(f"Ваш код для авторизации: {code}")
        e.send_message(user_email)