import enum

from global_modules.email.EmailDjangoRender import EmailDjangoRender
from sending.EngineSpecificSending.NewsEmail import NewsEmail
from sending.EngineSpecificSending.ProductEmail import ProductEmail


class SpecificSendingEmailEnum(enum.Enum):
    product = ProductEmail
    news = NewsEmail


def get_specific_sending_email_in_enum(message: str):
    field = message.split('/')[1].strip()

    return getattr(SpecificSendingEmailEnum, field).value


