from datetime import datetime

from celery import shared_task
from global_modules.email.core.basic import Email
from global_modules.email.EmailDjangoRender import EmailDjangoRender
from global_modules.email.core.contextEmail import ContextEmail
from sending.services.SpecificSendingEmail import get_specific_sending_email_in_enum
from user.models import MainUser




@shared_task()
def specific_sending(sending_id):
    from sending.models import SpecificSending
    sending_obj = SpecificSending.objects.get(id=sending_id)
    email_engine_class = get_specific_sending_email_in_enum(sending_obj.message)
    email_engine: EmailDjangoRender = email_engine_class(server="smtp.gmail.com", port=587)
    email_engine.text_in_render_django_file(context={'host': 'https://owa.gagtain.ru/',
                                                     'href': 'https://gagtain.ru/catalog'})
    user_list = MainUser.objects.filter(is_sending=True).only('email')
    with email_engine as email:
        for user in user_list:
            email.send_message(user.email)



