from djmoney.contrib.django_rest_framework import MoneyField
from rest_framework import serializers

from beekeeper_web_api.models import MainUser, ProductItem, Product, DimensionsProduct
from delivery.DeliveryInfo.Delivery.enum.DeliveryEngine import DeliveryEngine
from orders.models import Order, OrderItem
from beekeeper_web_api.serializers import Type_weightSerializers, ProductSerializer
from delivery.models import DeliveryTransaction
from user.serializers import RetrieveUserDefault


class DeliveryEngineChoiceSerializers(serializers.Serializer):
    delivery_engine = serializers.ChoiceField(choices=DeliveryEngine.choices())

    class Meta:
        fields = ['delivery_engine']


class DimensionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = DimensionsProduct
        fields = ['length', 'width', 'height']


class DeliveryProductItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer()
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
        fields = ['id', 'product_list_transaction', 'datetime', 'user', 'amount', 'amount_currency', 'status',
                  'payment']


class OrderRetrieveSerializers(serializers.ModelSerializer):
    product_list_transaction = OrderItemSerializer(many=True)
    user = RetrieveUserDefault()
    class Meta:
        model = Order
        fields = ['id', 'product_list_transaction', 'datetime', 'user', 'amount', 'amount_currency', 'status',
                  'payment']


class DeliveryTransactionCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = DeliveryTransaction
        fields = ['id', 'uuid', 'track_number',
                  'order_delivery_transaction', 'status', 'delivery_method', 'where', 'number']

class DeliveryTransactionSerializer(serializers.ModelSerializer):
    order_delivery_transaction = OrderRetrieveSerializers(many=True, read_only=True)

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
