import datetime

from delivery.dilivery_core import Client
from delivery.dilivery_core.Client import Configuration, token_verif
import requests
from delivery.dilivery_core.shemas import Delivery
class SDEKDelivery:

    client = Client

    @classmethod
    @token_verif(token=Configuration.token, time=Configuration.time)
    def get_token(cls):
        return {'token':Configuration.token}


    @classmethod
    @token_verif(token=Configuration.token, time=Configuration.time)
    def create_delivery(cls, delivery_obj: Delivery.DeliveryAdd):
        data = delivery_obj.to_json()
        a = requests.post(f'{Configuration.api_url}orders', headers={
            'Authorization': f"Bearer {Configuration.token}",
            'Content-Type': 'application/json',
            "Accept": "application/json",
        },
                      data=data
                      )
        return a

    @classmethod
    @token_verif(token=Configuration.token, time=Configuration.time)
    def get_delivery(cls, uuid):
        a = requests.get(f'{Configuration.api_url}orders/{uuid}/', headers={
            'Authorization': f"Bearer {Configuration.token}",
            'Content-Type': 'application/json',
            "Accept": "application/json",
        },
                      )
        return a

    @classmethod
    @token_verif(token=Configuration.token, time=Configuration.time)
    def get_price_delivery(cls, from_code, to_code):
        a = requests.post(f'{Configuration.api_url}calculator/tariff', headers={
            'Authorization': f"Bearer {Configuration.token}",
            'Content-Type': 'application/json',
            "Accept": "application/json",
        }, data={
    "type": "2",
    "currency": "1",
    "tariff_code": "136",
    "from_location": {
        "code": 44
    },
    "to_location": {
        "code": 44
    },
    "packages": [
        {
            "height": 10,
            "length": 10,
            "weight": 4000,
            "width": 10
        }
    ]
}
                      )
        return a