from djmoney.contrib.django_rest_framework import MoneyField
from rest_framework import serializers

from beekeeper_web_api.models import MainUser, OrderItem, ProductItem, Product
from beekeeper_web_api.models import Order
from beekeeper_web_api.serializers import Type_weightSerializers
from delivery.models import DeliveryTransaction

class DeliveryProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['name', 'image', 'price']

class DeliveryProductItemSerializer(serializers.ModelSerializer):
    product = DeliveryProductSerializer()
    weight = Type_weightSerializers()
    class Meta:
        model = ProductItem
        fields = ['weight', 'product']


class OrderItemSerializer(serializers.ModelSerializer):
    productItem = DeliveryProductItemSerializer()
    class Meta:
        model = OrderItem
        fields = ['id', 'count', 'productItem']


class DeliveryUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = MainUser
        fields = ['username', 'email', 'FIO']
class OrderSerializers(serializers.ModelSerializer):
    product_list_transaction = OrderItemSerializer(many=True)
    user = DeliveryUserSerializer()
    amount = MoneyField(max_digits=14, decimal_places=2)
    class Meta:
        model = Order
        fields = ['id', 'product_list_transaction', 'datetime', 'user', 'amount', 'amount_currency']


class DeliveryTransactionSerializer(serializers.ModelSerializer):
    order_delivery_transaction = OrderSerializers(many=True)
    class Meta:
        model = DeliveryTransaction
        fields = ['id','uuid', 'track_number', 'order_delivery_transaction', 'status']
