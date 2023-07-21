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
    items: list[PackagesItems]


@dataclass_json
@dataclass
class SenderPhones:
    number: str


@dataclass_json
@dataclass
class DefaultSenderPhones:
    number: str = '89142321321'


@dataclass_json
@dataclass
class Recipient:
    name: str
    phones: list[SenderPhones]


@dataclass_json
@dataclass
class DefaultRecipient:
    name: str = 'asd asd asd'
    phones: list[SenderPhones] = field(default_factory=DefaultSenderPhones)


@dataclass_json
@dataclass
class Sender:
    company: str
    name: str


@dataclass_json
@dataclass
class DefaultSender:
    company: str = 'Уварово пасечник'
    name: str = 'Белоусов Сергей Сергеевич'


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
    packages: Packages
    shipment_point: str = settings.SDEK_SHIPMENT_POINT
    recipient: Recipient = field(default_factory=DefaultRecipient)
    additional_order_type: list[AdditionalTypeOrder] = field(default_factory=list)
    sender: Sender = field(default_factory=DefaultSender)


@dataclass_json
@dataclass
class DeliveryResponseEntity:
    uuid: str


@dataclass_json
@dataclass
class DeliveryResponseRequests:
    request_uuid: str
    type: str
    date_time: str
    state: str


@dataclass_json
@dataclass
class DeliveryResponseAdd:
    entity: DeliveryResponseEntity
    requests: list[DeliveryResponseRequests]
