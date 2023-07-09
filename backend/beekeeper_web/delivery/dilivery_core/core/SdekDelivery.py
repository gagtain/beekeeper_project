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
    def create_order_delivery(cls, order_delivery_obj:Delivery.DeliveryAdd):
        pass
