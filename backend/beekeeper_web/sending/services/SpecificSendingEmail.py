import enum

from sending.EngineSpecificSending.NewsEmail import NewsEmail
from sending.EngineSpecificSending.ProductEmail import ProductEmail


class SpecificSendingEmailEnum(enum.Enum):
    product = ProductEmail
    news = NewsEmail

    @classmethod
    def choices(cls):
        return tuple((i.name, i.value) for i in cls)


def get_specific_sending_email_in_enum(message: str):
    field = message.split('/')[1].strip()

    return getattr(SpecificSendingEmailEnum, field).value
