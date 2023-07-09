from dataclasses_json import dataclass_json
from dataclasses import dataclass


@dataclass_json
@dataclass
class PaymentsAmount:
    value: str
    currency: str


@dataclass_json
@dataclass
class PaymentsConfirmation:
    type: str
    return_url: str


@dataclass_json
@dataclass
class PaymentsCreate:
    amount: PaymentsAmount
    confirmation: PaymentsConfirmation
    capture: bool
    description: str


@dataclass_json
@dataclass
class PaymentsResponseCreate:
    id: str
    status: str
    paid: bool
    amount: PaymentsAmount
    confirmation: PaymentsConfirmation
    created_at: str
    capture: bool
    description: str
    




