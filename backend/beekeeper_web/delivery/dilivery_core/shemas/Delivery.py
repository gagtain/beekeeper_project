import enum
from dataclasses import dataclass, field

from dataclasses_json import dataclass_json
from django.conf import settings


@dataclass_json
@dataclass
class Payment:
    value: float


@dataclass_json
@dataclass
class PackagesItems:
    name: str
    ware_key: str
    payment: Payment
    cost: float
    weight: int
    amount: int
    

@dataclass_json
@dataclass
class Packages:
    number: str
    weight: int
    length: int
    width: int
    height: int
    items: PackagesItems

@dataclass_json
@dataclass
class SenderPhones:
    number: str


class DefaultSenderPhones(SenderPhones):
    number = '89142321321'


class Recipient:
    name: str
    phones: list[SenderPhones] = field(default_factory=list[SenderPhones])


@dataclass_json
@dataclass
class Sender:
    company: str
    name: str


class DefaultSender(Sender):
    company = 'Уварово пасечник'
    name = 'Белоусов Сергей Сергеевич'


class TypeOrder(enum.Enum):
    online_shop = 1
    dostav = 2


class AdditionalTypeOrder(enum.Enum):
    LTL = 2
    Forward = 4
    Fulmit_Prih = 6
    Fulmit_oth = 7


@dataclass_json
@dataclass
class DeliveryAdd:
    tariff_code: int
    delivery_point: int
    type: TypeOrder
    additional_order_type: list[AdditionalTypeOrder] = field(default_factory=list)
    number: str = field(default_factory=str)
    comment: str = None
    shipment_point: int = settings.SDEK_SHIPMENT_POINT
    sender: Sender = DefaultSender
