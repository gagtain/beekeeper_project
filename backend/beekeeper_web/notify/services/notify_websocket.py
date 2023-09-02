from notify.models import Notify


def get_key_code_notify_websocket_message(instance: Notify):
    if instance.all:
        yield "notify__users__all"
    elif instance.users:
        yield f"notify_users__{instance.users.pk}"
    else:
        yield f"pk__{instance.pk}"

def get_key_code_user_notify_websocket_message(user: str):
    if user is not None:
        if user != 'all':
            yield f'notify_users__{user}'
        else:
            yield 'notify__users__all'
