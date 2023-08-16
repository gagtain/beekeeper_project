from django.conf import settings
from rest_framework import serializers
import sys

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


sys.path.append('.')
from .models import Product, MainUser, Category, ImageProduct, \
    BasketItem, FavoriteItem, RatingProductReview, Type_weight, ProductItem, DimensionsProduct
from orders.models import Order, OrderItem


class PhotoItemSerializers(serializers.ModelSerializer):
    class Meta:
        model = ImageProduct
        fields = ['photo']
class RatingProductReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = RatingProductReview
        fields = '__all__'


class RatingProductReviewRetrieveSerializer(serializers.ModelSerializer):
    class Meta:
        model = RatingProductReview
        fields = '__all__'
        depth = 1


class BasketInfoSerializer(serializers.Serializer):
    summ = serializers.CharField()
    count = serializers.CharField()

    class Meta:
        fields = '__all__'

class CategoryRetriveSerializers(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['name']

class DimensionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = DimensionsProduct
        fields = ['length', 'width', 'height', 'weight']

class Type_weightSerializers(serializers.ModelSerializer):
    class Meta:
        model = Type_weight
        fields = ['id', 'weight']
class ProductSerializer(serializers.ModelSerializer):
    ImageProductList = PhotoItemSerializers(many=True)
    category = CategoryRetriveSerializers(many=True)

    class Meta:
        model = Product
        fields = ['id', 'name', 'image', 'description', 'category',
                  'ImageProductList']

class ProductItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer()
    dimensions = DimensionsSerializer()
    weight = Type_weightSerializers()
    class Meta:
        model = ProductItem
        fields = ['id', 'price_currency', 'price', 'product', 'weight', 'dimensions']


class ProductItemNotProductSerializer(serializers.ModelSerializer):
    dimensions = DimensionsSerializer()
    weight = Type_weightSerializers()
    class Meta:
        model = ProductItem
        fields = ['id', 'price_currency', 'price', 'weight', 'dimensions']


class RetrieveProductName(serializers.ModelSerializer):

    class Meta:
        model = Product
        fields = ['id', 'name']


class RetrieveProduct(serializers.ModelSerializer):
    favorite = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        depth = 1
        fields = ['id', 'name', 'image', 'favorite', 'description', 'list_weight']

    def get_favorite(self, instance):
        return True if self.context.get('user_id') in instance.favorite_product.all() else False

    def get_image(self, instance):
        return settings.MEDIA_URL + str(instance.image)






class RetrieveProductRemoveToProdachen(serializers.ModelSerializer):
    category = CategoryRetriveSerializers(many=True)
    ImageProductList = PhotoItemSerializers(many=True)
    rating = serializers.FloatField(source='rating_product__rating__avg')
    productItemList = ProductItemNotProductSerializer(many=True)
    class Meta:
        model = Product
        fields = ['id', 'name', 'image', 'description', 'category', 'productItemList',
                  'ImageProductList', 'rating']


class BasketSerializer(serializers.ModelSerializer):
    productItem = ProductItemSerializer()

    class Meta:
        model = BasketItem
        fields = ['id', 'productItem', 'count']


class FavoriteSerializer(serializers.ModelSerializer):
    productItem = ProductItemSerializer()

    class Meta:
        model = FavoriteItem
        depth = 3
        fields = ['id', 'productItem']


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        depth = 3
        fields = ['id', 'productItem', 'count', 'price', 'price_currency']


class OrderSerializers(serializers.ModelSerializer):
    product_list_transaction = OrderItemSerializer(many=True)
    class Meta:
        model = Order
        depth = 2
        fields = ['id', 'amount', 'user', 'product_list_transaction', 'datetime', 'delivery', 'payment', 'status']
