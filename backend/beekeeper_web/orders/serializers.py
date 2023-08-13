from rest_framework import serializers

from beekeeper_web_api.serializers import ProductItemSerializer
from delivery.models import DeliveryTransaction
from orders.models import Order, OrderItem
from user.serializers import RetrieveUserDefault


class SumSerializer(serializers.Serializer):
    sum = serializers.CharField()

    class Meta:
        fields = ['sum']

class OrderItemSerializer(serializers.ModelSerializer):
    productItem = ProductItemSerializer()
    class Meta:
        model = OrderItem
        fields = ['id', 'productItem', 'count', 'price', 'price_currency']

class DeliveryTransactionSerializer(serializers.ModelSerializer):

    class Meta:
        model = DeliveryTransaction
        fields = ['id', 'uuid', 'track_number','status', 'delivery_method', 'where']

class OrderSerializers(serializers.ModelSerializer):
    product_list_transaction = OrderItemSerializer(many=True)
    user = RetrieveUserDefault()
    delivery = DeliveryTransactionSerializer()
    class Meta:
        model = Order
        depth = 2
        fields = ['id', 'amount', 'amount_currency', 'user', 'product_list_transaction', 'delivery', 'datetime', 'payment', 'status']