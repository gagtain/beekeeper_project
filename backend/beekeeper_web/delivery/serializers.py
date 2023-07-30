from djmoney.contrib.django_rest_framework import MoneyField
from rest_framework import serializers

from beekeeper_web_api.models import MainUser, ProductItem, Product, DimensionsProduct
from orders.models import Order, OrderItem
from beekeeper_web_api.serializers import Type_weightSerializers
from delivery.models import DeliveryTransaction

class DeliveryProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['name', 'image']

class DimensionsSerializer(serializers.ModelSerializer):

    class Meta:
        model = DimensionsProduct
        fields = ['length', 'width', 'height']

class DeliveryProductItemSerializer(serializers.ModelSerializer):
    product = DeliveryProductSerializer()
    weight = Type_weightSerializers()
    dimensions = DimensionsSerializer()
    class Meta:
        model = ProductItem
        fields = ['weight', 'product', 'dimensions']


class OrderItemSerializer(serializers.ModelSerializer):
    productItem = DeliveryProductItemSerializer()
    class Meta:
        model = OrderItem
        fields = ['id', 'count', 'productItem', 'price', 'price_currency']


class DeliveryUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = MainUser
        fields = ['username', 'email', 'FIO']

class OrderSerializers(serializers.ModelSerializer):
    product_list_transaction = OrderItemSerializer(many=True)
    amount = MoneyField(max_digits=14, decimal_places=2)
    user = DeliveryUserSerializer()

    class Meta:
        model = Order
        depth = 2
        fields = ['id', 'product_list_transaction', 'datetime', 'user', 'amount', 'amount_currency', 'status', 'payment']


class DeliveryTransactionSerializer(serializers.ModelSerializer):
    order_delivery_transaction = OrderSerializers(many=True)
    class Meta:
        model = DeliveryTransaction
        fields = ['id', 'uuid', 'track_number',
                  'order_delivery_transaction', 'status', 'delivery_method', 'where']


class CountSerializer(serializers.Serializer):
    count = serializers.CharField()

    class Meta:
        fields = ['count']
    def get_count(self, instance):
        print(instance, 213)